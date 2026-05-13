<?php
/**
 * GraphQL Extensions — v25
 * Racqueteer headless тема — кастомізації схеми WPGraphQL.
 *
 * Changelog v18:
 * - ROOT FIX (runtime) — Strategy H: фільтр graphql_resolve_field перехоплює поле `blocks`
 *   на типах Page/Post. Коли резолвер WPGraphQL Content Blocks повертає 0 блоків
 *   (тому що не розпізнає назви блоків `acf/*` у власному реєстрі), наш фільтр спрацьовує
 *   ПІСЛЯ резолвера, бачить порожній результат і замінює його блоками, розібраними напряму
 *   з `post_content` через власний WordPress-функцію `parse_blocks()`.
 *
 *   Кожен розібраний блок повертається як PHP-масив із:
 *     __typename → AcfRacqueteer*Block   (використовується graphql-php для type dispatch)
 *     id / type / tagName / innerHtml    (обов'язкові поля інтерфейсу Block)
 *     attrs                              (сирі атрибути блоку Gutenberg)
 *
 *   Наявні резолвери `racqueteerHero` / `racqueteerAbout` … (зареєстровані у секції
 *   Flat Rq*Fields нижче) читають `$source['attrs']['data']` — саме там ACF
 *   зберігає дані в коментарі блоку Gutenberg — тому дані ACF-полів повертаються автоматично.
 *
 *   wp_option `rq_diag_blocks_resolver` записується при кожному резолві Page.blocks
 *   для діагностики (post_id, content_len, raw_count, acf_count, types).
 *
 * - Sentinel: v18.
 * v17: Strategy G (pre-register Block/EditorBlock at priority 1) — схема виправлена.
 * v16: Strategy E priority 1 fix (недостатньо — eager type construction перемагає).
 * - ROOT FIX — Strategy G: Попередня реєстрація інтерфейсів Block + EditorBlock з пріоритетом 1
 *   у graphql_register_types, ДО того як WPGraphQL for ACF будує AcfRacqueteer*Block ObjectTypes
 *   з пріоритетом 10.
 *
 *   ЧОМУ v16 не спрацював:
 *   WPGraphQL for ACF v2.6.0 конструює WPObjectType-екземпляри ЗАВЧАСНО всередині register_type()
 *   (виклик з пріоритетом 10). Конструктор WPObjectType розв'язує імена інтерфейсів-рядків через
 *   TypeRegistry::get_type(). З пріоритетом 10 WPGraphQL Content Blocks ще NOT зареєстрував
 *   Block/EditorBlock (це відбувається з пріоритетом 100+), тому get_type('Block') → null → масив
 *   interfaces порожній після конструювання → фінальна схема: Interfaces: none.
 *
 *   Strategy E (register_graphql_interfaces_to_types з пріоритетом 1) ставить у чергу callback
 *   з пріоритетом 10, що викликає register_extra_interface(). Це спрацьовує на ТОМУ Ж пріоритеті 10
 *   що і конструювання типів блоків ACF, але внутрішня черговість callbacks (FIFO усередині priority 10)
 *   нестабільна, а властивість extra_type_interfaces не знайдено через reflection — що підтверджує:
 *   механізм не працював у цій версії WPGraphQL.
 *
 *   Рішення Strategy G:
 *   З пріоритетом 1 (до priority 10) ми попередньо реєструємо інтерфейси Block і EditorBlock
 *   з тими самими полями, що їх використовує Content Blocks (id, type, tagName, innerHtml, attributes,
 *   connections), плюс resolveType, що конвертує blockName → назву типу GraphQL. Коли типи блоків ACF
 *   будуються з пріоритетом 10, TypeRegistry::get_type('Block') повертає наш stub
 *   → Block IS у масиві interfaces → Page.blocks повертає всі ACF-блоки.
 *
 *   WPGraphQL TypeRegistry ігнорує повторні реєстрації (no-op для вже існуючих типів),
 *   тому реєстрація Block/EditorBlock від Content Blocks з пріоритетом 100 мовчки пропускається —
 *   наші stubs залишаються авторитетними.
 *
 * - Sentinel: v17.
 * v16: Strategy E priority 1 fix (недостатньо — eager type construction перемагає).
 * v15: Strategy F graphql_schema_config direct injection (HTTP 500 — readonly PHP 8.1 props).
 * v14: Strategy C priority 9→100. Strategy E: register_graphql_interfaces_to_types.
 * v13: діагностика TypeRegistry interfaces.
 * v12: додано attributes:Attribute + connections:[PostObjectUnion].
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ── Перехоплення PHP Fatal → wp_options ──────────────────────────────────────────
register_shutdown_function( function () {
    $error = error_get_last();
    if ( $error && in_array( $error['type'], array( E_ERROR, E_PARSE, E_CORE_ERROR, E_USER_ERROR ), true ) ) {
        $msg = $error['message'] . ' in ' . $error['file'] . ':' . $error['line'];
        if ( function_exists( 'update_option' ) ) {
            update_option( 'rq_last_fatal', $msg, false );
        }
    }
} );

// ── CORS ──────────────────────────────────────────────────────────────────────
add_filter( 'graphql_response_headers_to_send', function ( $headers ) {
    $headers['Access-Control-Allow-Origin']  = '*';
    $headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
    $headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    return $headers;
} );

add_action( 'init', function () {
    if ( isset( $_SERVER['REQUEST_METHOD'] ) && 'OPTIONS' === $_SERVER['REQUEST_METHOD']
         && ! empty( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ) ) {
        header( 'Access-Control-Allow-Origin: *' );
        header( 'Access-Control-Allow-Methods: POST, GET, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
        header( 'Access-Control-Max-Age: 86400' );
        status_header( 200 );
        exit;
    }
} );

// ── Сповіщення адміна ─────────────────────────────────────────────────────────────
add_action( 'init', function () {
    if ( ! function_exists( 'register_graphql_field' ) ) {
        add_action( 'admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>Racqueteer Theme:</strong> WPGraphQL plugin is required.</p></div>';
        } );
    }
    if ( ! class_exists( 'ACF' ) ) {
        add_action( 'admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>Racqueteer Theme:</strong> Advanced Custom Fields PRO is required.</p></div>';
        } );
    }
} );

// ── WPGraphQL: збільшити максимальну глибину запиту ──────────────────────────
add_filter( 'graphql_query_max_depth', function () {
    return 20;
} );

// ═════════════════════════════════════════════════════════════════════════════
// ІН'ЄКЦІЯ ІНТЕРФЕЙСУ BLOCK — підхід v17
//
// Мета: змусити всі типи AcfRacqueteer*Block реалізовувати інтерфейс Block,
// щоб WPGraphQL Content Blocks включав їх у результати Page.blocks.
//
// Strategy G: попередня реєстрація Block + EditorBlock з ПРІОРИТЕТОМ 1 ← ГОЛОВНИЙ FIX v17
// Strategy A: wpgraphql_acf_block_type_config — нативний хук WPGraphQL for ACF
// Strategy B: graphql_wp_object_type_config — час побудови схеми, пошук за шаблоном
// Strategy C: priority 100 — fallback-реєстрація для типів, пропущених ACF
// Strategy E: register_graphql_interfaces_to_types з ПРІОРИТЕТОМ 1 (підстраховка)
// ═════════════════════════════════════════════════════════════════════════════

// Назви типів блоків, що використовуються у стратегіях
$rq_acf_block_names = array(
    'AcfRacqueteerHeroBlock',
    'AcfRacqueteerAboutBlock',
    'AcfRacqueteerLocationsBlock',
    'AcfRacqueteerAmenitiesBlock',
    'AcfRacqueteerProgramsBlock',
    'AcfRacqueteerMembershipCtaBlock',
    'AcfRacqueteerSubscriptionsBlock',
    'AcfRacqueteerTestimonialsBlock',
    'AcfRacqueteerEventsBlock',
    'AcfRacqueteerMembershipHeroBlock',
    'AcfRacqueteerSubscriptionsDetailBlock',
    'AcfRacqueteerPriceCompareBlock',
    'AcfRacqueteerPrivateEventsHeroBlock',
    'AcfRacqueteerGalleryBlock',
    'AcfRacqueteerLogoMarqueeBlock',
    'AcfRacqueteerAboutHeroBlock',
    'AcfRacqueteerMissionBlock',
    'AcfRacqueteerContactBlock',
    'AcfRacqueteerCareersHeroBlock',
    'AcfRacqueteerJobListingsBlock',
    'AcfRacqueteerCareerContactBlock',
);

// ── Strategy A: нативний фільтр WPGraphQL for ACF ───────────────────────
add_filter( 'wpgraphql_acf_block_type_config', function ( $config ) {
    if ( ! is_array( $config ) ) {
        return $config;
    }
    $interfaces = isset( $config['interfaces'] ) ? (array) $config['interfaces'] : array();
    if ( ! in_array( 'Block', $interfaces, true ) ) {
        $interfaces[] = 'Block';
    }
    // EditorBlock необов'язковий у деяких білдах WPGraphQL Content Blocks.
    // Не варто примусово додавати можливо відсутній інтерфейс на цьому ранньому етапі.
    $config['interfaces'] = $interfaces;
    update_option( 'rq_diag_strategy_a', 'fired:' . ( isset( $config['name'] ) ? $config['name'] : 'unknown' ), false );
    return $config;
}, 5 );

// Альтернативна назва фільтру, яку використовують деякі версії ACF/WPGraphQL
add_filter( 'graphql_acf_block_type_config', function ( $config ) {
    if ( ! is_array( $config ) ) {
        return $config;
    }
    $interfaces = isset( $config['interfaces'] ) ? (array) $config['interfaces'] : array();
    if ( ! in_array( 'Block', $interfaces, true ) ) {
        $interfaces[] = 'Block';
    }
    $config['interfaces'] = $interfaces;
    return $config;
}, 5 );

// ═══════════════════════════════════════════════════════════════════════════
// ── Strategy G: Попередня реєстрація інтерфейсів Block + EditorBlock ──────────────
//
// Спрацьовує з пріоритетом 1 — ДО того як WPGraphQL for ACF будує ACF block ObjectTypes з пріоритетом 10.
//
// Проблема: WPGraphQL for ACF v2.6.0 конструює WPObjectType-екземпляри завчасно всередині
// TypeRegistry::register_type(). Конструктор розв'язує імена інтерфейсів-рядків через
// TypeRegistry::get_type(). WPGraphQL Content Blocks реєструє Block з пріоритетом 100+,
// тому з priority 10 (час конструювання блоків ACF) get_type('Block') → null → інтерфейси губляться.
//
// Рішення: реєструємо Block/EditorBlock самостійно з priority 1. WPGraphQL TypeRegistry ігнорує
// повторні реєстрації (no-op якщо назва вже зареєстрована), тому пізніша реєстрація від Content Blocks
// мовчки пропускається і наші stubs залишаються. Коли типи блоків ACF будуються з priority 10,
// TypeRegistry::get_type('Block') повертає наш stub → Block збережено.
//
// resolveType: WPGraphQL Content Blocks встановлює __typename на кожному блок-масиві. graphql-php
// використовує __typename напряму перед викликом resolveType, тому наш resolveType є лише запасним.
// Він також обробляє перетворення blockName → type name для надійності.
// ─────────────────────────────────────────────────────────────────────────────
add_action( 'graphql_register_types', function () {
    if ( ! function_exists( 'register_graphql_interface_type' ) ) {
        update_option( 'rq_diag_strategy_g', 'SKIP:function_not_found', false );
        return;
    }

    // resolveType: відображає масив блоку → конкретний тип-об'єкт WPGraphQL.
    $resolve_type = static function ( $block ) {
        try {
            $type_name = null;
            if ( is_array( $block ) ) {
                // WPGraphQL Content Blocks встановлює __typename або graphqlTypeName напряму.
                $type_name = isset( $block['__typename'] )     ? $block['__typename']
                           : ( isset( $block['graphqlTypeName'] ) ? $block['graphqlTypeName'] : null );

                // Fallback: вивести з blockName, наприклад 'acf/racqueteer-hero' → 'AcfRacqueteerHeroBlock'
                if ( ! $type_name && ! empty( $block['blockName'] ) ) {
                    $parts = explode( '/', $block['blockName'] );
                    $converted = '';
                    foreach ( $parts as $part ) {
                        $words = explode( '-', $part );
                        foreach ( $words as $word ) {
                            $converted .= ucfirst( strtolower( $word ) );
                        }
                    }
                    $type_name = $converted . 'Block';
                }
            }
            if ( $type_name && class_exists( '\WPGraphQL' ) && method_exists( '\WPGraphQL', 'get_type_registry' ) ) {
                $reg = \WPGraphQL::get_type_registry();
                if ( $reg ) {
                    foreach ( array( 'get_type', 'get_registered_type' ) as $method ) {
                        if ( method_exists( $reg, $method ) ) {
                            $t = $reg->{$method}( $type_name );
                            if ( $t ) {
                                return $t;
                            }
                        }
                    }
                }
            }
        } catch ( \Throwable $ignored ) {}
        return null;
    };

    // Поля, які WPGraphQL Content Blocks оголошує на інтерфейсі Block.
    // Реєстрація тих самих полів забезпечує сумісність схеми.
    $block_fields = array(
        'id'          => array( 'type' => array( 'non_null' => 'ID' ) ),
        'type'        => array( 'type' => 'String' ),
        'tagName'     => array( 'type' => 'String' ),
        'innerHtml'   => array( 'type' => 'String' ),
        'attributes'  => array( 'type' => 'Attribute' ),
        'connections' => array( 'type' => array( 'list_of' => 'PostObjectUnion' ) ),
    );

    $g_log = array();

    try {
        register_graphql_interface_type( 'Block', array(
            'description' => 'Інтерфейс Block — попередньо зареєстровано з priority 1 для ACF timing fix (v17)',
            'fields'      => $block_fields,
            'resolveType' => $resolve_type,
        ) );
        $g_log[] = 'Block:ok';
    } catch ( \Throwable $e ) {
        $g_log[] = 'Block:err:' . $e->getMessage();
    }

    try {
        register_graphql_interface_type( 'EditorBlock', array(
            'description' => 'Інтерфейс EditorBlock — попередньо зареєстровано з priority 1 для ACF timing fix (v17)',
            'fields'      => $block_fields,
            'resolveType' => $resolve_type,
        ) );
        $g_log[] = 'EditorBlock:ok';
    } catch ( \Throwable $e ) {
        $g_log[] = 'EditorBlock:err:' . $e->getMessage();
    }

    update_option( 'rq_diag_strategy_g', implode( '|', $g_log ), false );
}, 1 ); // ← ОБОВ'ЯЗКОВО priority 1, спрацьовує до блоків ACF з priority 10

// ── Strategy E: збережено як підстраховка ───────────────────────────────── (початково ГОЛОВНИЙ FIX v16)
//
// register_graphql_interfaces_to_types() виклик у graphql_register_types ПРІОРИТЕТ 1.
// Оскільки Strategy G тепер попередньо реєструє Block з priority 1, це вторинна страховка.
// Ставить у чергу внутрішній callback з priority 10, що викликає register_extra_interface() для кожної
// назви типу блоку ACF, на випадок якщо eager type construction пропустив Block для будь-якого типу.
// ═══════════════════════════════════════════════════════════════════════════
add_action( 'graphql_register_types', function () use ( $rq_acf_block_names ) {
    if ( ! function_exists( 'register_graphql_interfaces_to_types' ) ) {
        update_option( 'rq_diag_strategy_e', 'SKIP:function_not_found', false );
        return;
    }
    try {
        register_graphql_interfaces_to_types( array( 'Block' ), $rq_acf_block_names );
        update_option( 'rq_diag_strategy_e', 'fired_priority_1:ok', false );
    } catch ( \Throwable $e ) {
        update_option( 'rq_diag_strategy_e', 'err:' . $e->getMessage(), false );
    }
}, 1 ); // ← priority 1 — КРИТИЧНО для fix v16

// ── v17 DIAGNOSTICS: перевірка TypeRegistry з priority 99 ───────────────────────
add_action( 'graphql_register_types', function () {
    try {
        $reg = class_exists( '\WPGraphQL' ) ? \WPGraphQL::get_type_registry() : null;

        $lookup = function ( $reg, $name ) {
            if ( ! $reg ) { return 'no_reg'; }
            foreach ( array( 'get_type', 'get_registered_type' ) as $method ) {
                if ( method_exists( $reg, $method ) ) {
                    $t = $reg->{$method}( $name );
                    if ( $t ) { return 'found_via_' . $method . ':' . ( is_array( $t ) ? 'array_config' : get_class( $t ) ); }
        // Також lowercase
                    $t = $reg->{$method}( strtolower( $name ) );
                    if ( $t ) { return 'found_lc_via_' . $method . ':' . ( is_array( $t ) ? 'array_config' : get_class( $t ) ); }
                }
            }
            if ( function_exists( 'graphql_get_type' ) ) {
                $t = graphql_get_type( $name );
                if ( $t ) { return 'found_via_graphql_get_type'; }
            }
            return 'null';
        };

        $val = 'Block=' . $lookup( $reg, 'Block' )
             . '|EditorBlock=' . $lookup( $reg, 'EditorBlock' )
             . '|Node=' . $lookup( $reg, 'Node' )
             . '|StrategyG=' . get_option( 'rq_diag_strategy_g', 'not_set' );
        update_option( 'rq_diag_ifaces_in_reg', $val, false );

        // Зразок зареєстрованих назв типів з priority 99 (для діагностики іменування ключів)
        if ( $reg && method_exists( $reg, 'get_type_map' ) ) {
            $map   = $reg->get_type_map();
            $names = array_slice( array_keys( $map ), 0, 40 );
            update_option( 'rq_diag_v16_typemap_p99', implode( '|', $names ), false );
        }

        // Перевірка extra_type_interfaces — підтверджує, що Strategy E з priority 1 спрацювала
        $extra_ifaces = 'unknown';
        if ( $reg ) {
            try {
                $ref = new \ReflectionObject( $reg );
                foreach ( array( 'extra_type_interfaces', 'type_registered_interfaces' ) as $prop ) {
                    if ( $ref->hasProperty( $prop ) ) {
                        $p = $ref->getProperty( $prop );
                        $p->setAccessible( true );
                        $val_prop = $p->getValue( $reg );
                        if ( is_array( $val_prop ) ) {
                            $sample_key = 'AcfRacqueteerHeroBlock';
                            $extra_ifaces = isset( $val_prop[ $sample_key ] )
                                ? $prop . '[HeroBlock]=' . implode( ',', (array) $val_prop[ $sample_key ] )
                                : $prop . ':set,HeroBlock=missing(' . count( $val_prop ) . 'entries)';
                        }
                        break;
                    }
                }
            } catch ( \Throwable $ignored ) {
                $extra_ifaces = 'reflection_failed';
            }
        }
        update_option( 'rq_diag_extra_ifaces', $extra_ifaces, false );

    } catch ( \Throwable $e ) {
        update_option( 'rq_diag_ifaces_in_reg', 'err:' . $e->getMessage(), false );
    }
}, 99 );

// ── Strategy B: graphql_wp_object_type_config — спрацьовує під час побудови схеми ──────
// На цьому етапі всі callbacks graphql_register_types виконані.
// Block тепер має бути у TypeRegistry (через get_type).
add_filter( 'graphql_wp_object_type_config', function ( $config ) {
    if ( ! is_array( $config ) || ! isset( $config['name'] ) ) {
        return $config;
    }

    $name = $config['name'];

    // Відстеження всіх назв типів Acf* для діагностики
    if ( 0 === strncmp( $name, 'Acf', 3 ) ) {
        $seen = get_option( 'rq_diag_type_names', array() );
        if ( ! is_array( $seen ) ) { $seen = array(); }
        $seen[ $name ] = 1;
        update_option( 'rq_diag_type_names', $seen, false );
    }

    // Ін'єкція інтерфейсу Block для типів AcfRacqueteer*Block
    if ( 0 === strncmp( $name, 'Acf', 3 ) && 'Block' === substr( $name, -5 ) ) {
        $before = isset( $config['interfaces'] ) ? implode( ',', (array) $config['interfaces'] ) : 'NONE';

            try {
                // На момент graphql_wp_object_type_config спробуємо отримати фактичний ОБʼЄКТ типу
                // (не просто рядок) — всі callbacks graphql_register_types вже виконані.
            $block_type  = null;
            $editor_type = null;
            $reg_info    = 'no_reg';

            if ( class_exists( '\WPGraphQL' ) && method_exists( '\WPGraphQL', 'get_type_registry' ) ) {
                $reg = \WPGraphQL::get_type_registry();
                if ( $reg ) {
                    foreach ( array( 'get_type', 'get_registered_type' ) as $method ) {
                        if ( method_exists( $reg, $method ) ) {
                            if ( ! $block_type ) {
                                $b = $reg->{$method}( 'Block' );
                                if ( ! $b ) { $b = $reg->{$method}( 'block' ); }
                                if ( $b ) { $block_type = $b; }
                            }
                            if ( ! $editor_type ) {
                                $e = $reg->{$method}( 'EditorBlock' );
                                if ( ! $e ) { $e = $reg->{$method}( 'editorblock' ); }
                                if ( $e ) { $editor_type = $e; }
                            }
                        }
                    }
                    $reg_info = 'B=' . ( $block_type ? ( is_array( $block_type ) ? 'array_config' : get_class( $block_type ) ) : 'null' )
                              . ',E=' . ( $editor_type ? ( is_array( $editor_type ) ? 'array_config' : get_class( $editor_type ) ) : 'null' );
                }
            }

            $interfaces = isset( $config['interfaces'] ) ? (array) $config['interfaces'] : array();

            // Переважно реальні обʼєкти типів; рядки — запасний варіант
            $required_ifaces = array( 'Block' => $block_type );
            // Додати EditorBlock тільки якщо ми отримали реальний обʼєкт типу.
            if ( $editor_type && ! is_array( $editor_type ) ) {
                $required_ifaces['EditorBlock'] = $editor_type;
            }

            foreach ( $required_ifaces as $iface_name => $iface_obj ) {
                // Перевірити, чи вже присутній (як рядок або назва обʼєкта)
                $already = false;
                foreach ( $interfaces as $existing ) {
                    if ( is_string( $existing ) && $existing === $iface_name ) { $already = true; break; }
                    if ( is_object( $existing ) ) {
                        $n = isset( $existing->name ) ? $existing->name : ( isset( $existing->config['name'] ) ? $existing->config['name'] : '' );
                        if ( $n === $iface_name ) { $already = true; break; }
                    }
                }
                if ( ! $already ) {
                    // Використати реальний обʼєкт якщо доступний І є правильним екземпляром типу, інакше рядок
                    $interfaces[] = ( $iface_obj && ! is_array( $iface_obj ) ) ? $iface_obj : $iface_name;
                }
            }

            $config['interfaces'] = $interfaces;
            $after = implode( ',', array_map( function ( $i ) {
                if ( is_string( $i ) ) { return $i; }
                if ( is_object( $i ) ) { return isset( $i->name ) ? $i->name : get_class( $i ); }
                return '?';
            }, $interfaces ) );

            update_option( 'rq_diag_strategy_b',
                'hit:' . $name . '|before:' . $before . '|after:' . $after . '|reg:' . $reg_info,
                false );

        } catch ( \Throwable $e ) {
            update_option( 'rq_diag_strategy_b', 'err:' . $e->getMessage(), false );
        }
    }

    return $config;
}, 999 );

// ── Strategy C: FALLBACK-реєстрація з пріоритетом 100 ───────────────────────────
// Спрацьовує після WPGraphQL for ACF (~priority 10) — реєструє пропущені типи блоків.
// Інтерфейси тут навмисно порожні; Strategy E (priority 1) ін'єктує їх через
// TypeRegistry::extra_type_interfaces, яке застосовується під час побудови типів.
add_action( 'graphql_register_types', function () use ( $rq_acf_block_names ) {
    if ( ! function_exists( 'register_graphql_object_type' ) ) {
        return;
    }

    foreach ( $rq_acf_block_names as $type_name ) {
        $already_registered = false;
        try {
            if ( class_exists( '\WPGraphQL' ) && method_exists( '\WPGraphQL', 'get_type_registry' ) ) {
                $reg = \WPGraphQL::get_type_registry();
                if ( $reg ) {
                    foreach ( array( 'get_registered_type', 'get_type' ) as $method ) {
                        if ( method_exists( $reg, $method ) && $reg->{$method}( $type_name ) ) {
                            $already_registered = true;
                            break;
                        }
                    }
                }
            }
            if ( ! $already_registered && function_exists( 'graphql_get_type' ) && graphql_get_type( $type_name ) ) {
                $already_registered = true;
            }
        } catch ( \Throwable $e ) {
            // Продовжити спробу реєстрації
        }

        if ( $already_registered ) {
            continue;
        }

        try {
            register_graphql_object_type( $type_name, array(
                'description' => 'ACF Gutenberg block: ' . $type_name,
                // Переконатись, що fallback-типи відповідають контракту WPGraphQL Content Blocks.
                // Без цих interfaces/fields Page.blocks виключає тип блоку.
                'interfaces'  => array( 'Block' ),
                'fields'      => array(
                    'id'       => array(
                        'type'    => array( 'non_null' => 'ID' ),
                        'resolve' => function ( $src ) use ( $type_name ) {
                            return isset( $src['id'] ) ? $src['id'] : $type_name . '_' . uniqid( '', true );
                        },
                    ),
                    'type'     => array(
                        'type'    => 'String',
                        'resolve' => function ( $src ) {
                            return isset( $src['blockName'] ) ? $src['blockName'] : ( isset( $src['name'] ) ? $src['name'] : null );
                        },
                    ),
                    'tagName'  => array(
                        'type'    => 'String',
                        'resolve' => function ( $src ) {
                            return isset( $src['attrs']['tagName'] ) ? $src['attrs']['tagName'] : 'div';
                        },
                    ),
                    'innerHtml' => array(
                        'type'    => 'String',
                        'resolve' => function ( $src ) {
                            return isset( $src['innerHTML'] ) ? $src['innerHTML'] : '';
                        },
                    ),
                    'attributes' => array(
                        'type'    => 'Attribute',
                        'resolve' => function () {
                            return null;
                        },
                    ),
                    'connections' => array(
                        'type'    => array( 'list_of' => 'PostObjectUnion' ),
                        'resolve' => function () {
                            return array();
                        },
                    ),
                ),
            ) );
        } catch ( \Throwable $e ) {
            if ( function_exists( 'error_log' ) ) {
                error_log( 'RQ [' . $type_name . '] fallback reg error: ' . $e->getMessage() );
            }
        }
    }
}, 100 );

// ═════════════════════════════════════════════════════════════════════════════
// Sentinel деплою + enum-и
// ═════════════════════════════════════════════════════════════════════════════
add_action( 'graphql_register_types', function () {
    if ( ! function_exists( 'register_graphql_enum_type' ) ) {
        return;
    }
    try {
        register_graphql_enum_type( 'LocationStatus', array(
            'description' => 'Статус локації Racqueteer',
            'values'      => array(
                'available'   => array( 'value' => 'available' ),
                'coming_soon' => array( 'value' => 'coming_soon' ),
            ),
        ) );
    } catch ( \Throwable $e ) {}
    try {
        register_graphql_enum_type( 'RqDeployVersion', array(
            'description' => 'Sentinel версії деплою',
            'values'      => array( 'v25' => array( 'value' => 'v25' ) ),
        ) );
    } catch ( \Throwable $e ) {}
} );

// ═════════════════════════════════════════════════════════════════════════════
// Location Status + Amenities — ручна реєстрація (v24)
//
// Проблема (коренева причина):
//   WPGraphQL for ACF v2.6.x для ACF select-полів читає сирий post_meta,
//   який WordPress зберігає серіалізованим масивом ['available']. Всі спроби
//   перехопити це через acf/format_value, graphql_resolve_field або
//   get_post_metadata НЕ спрацювали, бо WPGraphQL for ACF обходить стандартні
//   WordPress-хуки для select-підтипів через власний data-loader.
//   У PHP 8.x спроба (string)['available'] кидає TypeError → Internal server error.
//
// Рішення (v24): show_in_graphql=false на status та amenities в acf-blocks.php;
//   обидва поля реєструються ВРУЧНУ тут з власними резолверами,
//   які використовують get_field() — ACF-функцію, що коректно форматує значення.
//
//   • Location.locationStatus  : String
//   • Location.locationAmenities: [LocationAmenityItem]
// ═════════════════════════════════════════════════════════════════════════════
add_action( 'graphql_register_types', function () {

    // ── locationStatus ──────────────────────────────────────────────────────
    // Повністю обходить WPGraphQL for ACF select-резолвер.
    // get_field() повертає відформатований рядок (через ACF format_value).
    // Якщо get_field() поверне масив (legacy data), нормалізуємо тут.
    try {
        register_graphql_field( 'Location', 'locationStatus', array(
            'type'        => 'String',
            'description' => 'Статус локації: available або coming_soon',
            'resolve'     => function ( $post ) {
                if ( ! function_exists( 'get_field' ) ) { return 'available'; }
                $post_id = is_object( $post ) ? ( $post->databaseId ?? $post->ID ?? null ) : null;
                if ( ! $post_id ) { return 'available'; }
                $val = get_field( 'field_loc_status', $post_id );
                if ( is_array( $val ) ) { $val = $val[0] ?? ''; }
                $val = strtolower( trim( (string) $val ) );
                return $val ?: 'available';
            },
        ) );
    } catch ( \Throwable $e ) {}

    // ── LocationAmenityItem type ─────────────────────────────────────────────
    try {
        register_graphql_object_type( 'LocationAmenityItem', array(
            'description' => 'Один запис Club Amenity локації',
            'fields'      => array(
                'icon'  => array( 'type' => 'String', 'description' => 'Ключ іконки (courts, lounge, cafe …)' ),
                'label' => array( 'type' => 'String', 'description' => 'Текст для відображення' ),
            ),
        ) );
    } catch ( \Throwable $e ) {}

    // ── locationAmenities ────────────────────────────────────────────────────
    try {
        register_graphql_field( 'Location', 'locationAmenities', array(
            'type'        => array( 'list_of' => 'LocationAmenityItem' ),
            'description' => 'Club Amenities (repeater) — icon + label',
            'resolve'     => function ( $post ) {
                if ( ! function_exists( 'get_field' ) ) { return array(); }
                $post_id = is_object( $post ) ? ( $post->databaseId ?? $post->ID ?? null ) : null;
                if ( ! $post_id ) { return array(); }
                $rows = get_field( 'amenities', $post_id );
                if ( ! is_array( $rows ) || empty( $rows ) ) { return array(); }
                $result = array();
                foreach ( $rows as $row ) {
                    if ( ! is_array( $row ) ) { continue; }
                    $icon  = $row['icon']  ?? '';
                    $label = $row['label'] ?? '';
                    if ( is_array( $icon ) )  { $icon  = $icon[0]  ?? ''; }
                    if ( is_array( $label ) ) { $label = $label[0] ?? ''; }
                    $result[] = array(
                        'icon'  => strtolower( trim( (string) $icon ) ),
                        'label' => trim( (string) $label ),
                    );
                }
                return $result;
            },
        ) );
    } catch ( \Throwable $e ) {}

}, 5 );

// ── Залишкові safety-net фільтри (не шкодять, але вже не критичні) ──────────
add_filter( 'acf/format_value/key=field_loc_status', function ( $value, $post_id, $field ) {
    if ( is_array( $value ) ) { $value = $value[0] ?? ''; }
    return strtolower( trim( is_string( $value ) ? $value : (string) $value ) );
}, 1, 3 );

// ── Amenity.imageLayout — ручна реєстрація (select → String) ─────────────────────────
// show_in_graphql=false в acf-blocks.php; реєструємо вручну щоб уникнути
// WPGraphQL for ACF v2.6.x serialized-array TypeError на select-полях.
// Реєструємо і на Amenity (post node), і на AmenityFields (ACF field group wrapper),
// щоб підтримати обидва варіанти запиту:
//   amenities { nodes { imageLayout } }          — через Amenity
//   amenities { nodes { amenityFields { imageLayout } } } — через AmenityFields
add_action( 'graphql_register_types', function () {
    $image_layout_resolver = function ( $source ) {
        if ( ! function_exists( 'get_field' ) ) { return 'single'; }
        // $source може бути або WPGraphQL post model object, або масивом з post_id
        $post_id = null;
        if ( is_object( $source ) ) {
            $post_id = isset( $source->databaseId ) ? (int) $source->databaseId
                     : ( isset( $source->ID ) ? (int) $source->ID : null );
        } elseif ( is_array( $source ) ) {
            $post_id = isset( $source['databaseId'] ) ? (int) $source['databaseId']
                     : ( isset( $source['ID'] ) ? (int) $source['ID'] : null );
        }
        if ( ! $post_id ) { return 'single'; }
        $val = get_field( 'field_amenity_image_layout', $post_id );
        if ( is_array( $val ) ) { $val = $val[0] ?? ''; }
        $val = strtolower( trim( (string) $val ) );
        return $val ?: 'single';
    };

    // На post node (Amenity)
    try {
        register_graphql_field( 'Amenity', 'imageLayout', array(
            'type'        => 'String',
            'description' => 'Image layout: single or split',
            'resolve'     => $image_layout_resolver,
        ) );
    } catch ( \Throwable $e ) {}

    // На AmenityFields (ACF field group wrapper type), щоб підтримати
    // запит amenityFields { imageLayout }
    try {
        register_graphql_field( 'AmenityFields', 'imageLayout', array(
            'type'        => 'String',
            'description' => 'Image layout: single or split',
            'resolve'     => function ( $source ) use ( $image_layout_resolver ) {
                // AmenityFields resolver receives the post object as root
                return $image_layout_resolver( $source );
            },
        ) );
    } catch ( \Throwable $e ) {}

    // ── Amenity.images — ручна реєстрація (gallery → [AmenityImage]) ──────────
    // show_in_graphql=false в acf-blocks.php; реєструємо вручну щоб повністю
    // уникнути AcfMediaItemConnection і відповідних помилок схеми.
    // Повертає масив об'єктів { sourceUrl } через власний get_field() резолвер.

    try {
        register_graphql_object_type( 'AmenityImage', array(
            'description' => 'Зображення amenity',
            'fields'      => array(
                'sourceUrl' => array( 'type' => 'String' ),
            ),
        ) );
    } catch ( \Throwable $e ) {}

    $images_resolver = function ( $source ) {
        if ( ! function_exists( 'get_field' ) ) { return array(); }
        $post_id = null;
        if ( is_object( $source ) ) {
            $post_id = isset( $source->databaseId ) ? (int) $source->databaseId
                     : ( isset( $source->ID ) ? (int) $source->ID : null );
        } elseif ( is_array( $source ) ) {
            $post_id = isset( $source['databaseId'] ) ? (int) $source['databaseId']
                     : ( isset( $source['ID'] ) ? (int) $source['ID'] : null );
        }
        if ( ! $post_id ) { return array(); }
        $imgs = get_field( 'field_amenity_images', $post_id );
        if ( ! is_array( $imgs ) || empty( $imgs ) ) { return array(); }
        $result = array();
        foreach ( $imgs as $img ) {
            if ( is_array( $img ) && ! empty( $img['url'] ) ) {
                $result[] = array( 'sourceUrl' => $img['url'] );
            } elseif ( is_numeric( $img ) && (int) $img > 0 ) {
                $url = wp_get_attachment_url( (int) $img );
                if ( $url ) { $result[] = array( 'sourceUrl' => $url ); }
            } elseif ( is_string( $img ) && '' !== $img ) {
                $result[] = array( 'sourceUrl' => $img );
            }
        }
        return $result;
    };

    // На post node (Amenity)
    try {
        register_graphql_field( 'Amenity', 'images', array(
            'type'        => array( 'list_of' => 'AmenityImage' ),
            'description' => 'Gallery images for this amenity',
            'resolve'     => $images_resolver,
        ) );
    } catch ( \Throwable $e ) {}

    // На AmenityFields wrapper
    try {
        register_graphql_field( 'AmenityFields', 'images', array(
            'type'        => array( 'list_of' => 'AmenityImage' ),
            'description' => 'Gallery images for this amenity',
            'resolve'     => $images_resolver,
        ) );
    } catch ( \Throwable $e ) {}
}, 5 );


// ═════════════════════════════════════════════════════════════════════════════
// Плоскі типи Rq*Fields + плоске ACF-поле на кожному типі блоку
// Priority 5 — реєструється до побудови типів блоків
// ═════════════════════════════════════════════════════════════════════════════
add_action( 'graphql_register_types', function () {
    if ( ! function_exists( 'register_graphql_object_type' ) ) {
        return;
    }

    $all_fields = array(
        'RqRacqueteerHeroFields'                => array( 'title', 'description', 'ctaPrimaryText', 'ctaPrimaryUrl', 'ctaSecondaryText', 'ctaSecondaryUrl', 'videoUrl' ),
        'RqRacqueteerAboutFields'               => array( 'label', 'title', 'description', 'stat1Number', 'stat1Label', 'stat2Number', 'stat2Label', 'leftImage', 'rightImage' ),
        'RqRacqueteerLocationsFields'           => array( 'label', 'title', 'description' ),
        'RqRacqueteerAmenitiesFields'           => array( 'label', 'title', 'amenities' ),
        'RqRacqueteerProgramsFields'            => array( 'label', 'title', 'description', 'tabs' ),
        'RqRacqueteerMembershipCtaFields'       => array( 'label', 'title', 'description', 'ctaText', 'ctaUrl', 'bgImage' ),
        'RqRacqueteerSubscriptionsFields'       => array( 'label', 'title', 'description' ),
        'RqRacqueteerTestimonialsFields'        => array( 'label', 'title', 'description' ),
        'RqRacqueteerEventsFields'              => array( 'title', 'description', 'ctaText', 'ctaUrl', 'image', 'whatIncludes' ),
        'RqRacqueteerMembershipHeroFields'      => array( 'label', 'title', 'description', 'priceStarting', 'priceUnit', 'ctaText', 'videoUrl' ),
        'RqRacqueteerSubscriptionsDetailFields' => array( 'label', 'title', 'description' ),
        'RqRacqueteerPriceCompareFields'        => array( 'label', 'title', 'description' ),
        'RqRacqueteerPrivateEventsHeroFields'   => array( 'label', 'title', 'description', 'ctaText', 'ctaUrl', 'videoUrl', 'whatIncludes' ),
        'RqRacqueteerGalleryFields'             => array( 'label', 'title', 'description', 'images' ),
        'RqRacqueteerLogoMarqueeFields'         => array( 'label', 'title', 'logos' ),
        'RqRacqueteerAboutHeroFields'           => array( 'label', 'title', 'description', 'videoUrl' ),
        'RqRacqueteerMissionFields'             => array( 'label', 'title', 'description', 'image' ),
        'RqRacqueteerContactFields'             => array( 'label', 'title', 'description', 'email', 'phone', 'ctaText', 'ctaUrl' ),
        'RqRacqueteerCareersHeroFields'         => array( 'label', 'title', 'description', 'videoUrl' ),
        'RqRacqueteerJobListingsFields'         => array( 'label', 'title', 'description' ),
        'RqRacqueteerCareerContactFields'       => array( 'label', 'title', 'description', 'ctaText', 'ctaUrl', 'image' ),
    );

    foreach ( $all_fields as $fields_type => $fields ) {
        $gql_fields = array();
        foreach ( $fields as $f ) {
            $gql_fields[ $f ] = array( 'type' => 'String' );
        }
        try {
            register_graphql_object_type( $fields_type, array(
                'description' => 'Плоскі ACF-поля для ' . $fields_type,
                'fields'      => $gql_fields,
            ) );
        } catch ( \Throwable $e ) {
            // Ігнорувати повторну реєстрацію
        }
    }

    // Зареєструвати плоске ACF-поле на кожному типі блоку
    $block_field_map = array(
        'AcfRacqueteerHeroBlock'                => array( 'field' => 'racqueteerHero',                'type' => 'RqRacqueteerHeroFields' ),
        'AcfRacqueteerAboutBlock'               => array( 'field' => 'racqueteerAbout',               'type' => 'RqRacqueteerAboutFields' ),
        'AcfRacqueteerLocationsBlock'           => array( 'field' => 'racqueteerLocations',           'type' => 'RqRacqueteerLocationsFields' ),
        // NOTE: AcfRacqueteerAmenitiesBlock uses a custom resolver below (repeater) — skip here
        'AcfRacqueteerProgramsBlock'            => array( 'field' => 'racqueteerPrograms',            'type' => 'RqRacqueteerProgramsFields' ),
        'AcfRacqueteerMembershipCtaBlock'       => array( 'field' => 'racqueteerMembershipCta',       'type' => 'RqRacqueteerMembershipCtaFields' ),
        'AcfRacqueteerSubscriptionsBlock'       => array( 'field' => 'racqueteerSubscriptions',       'type' => 'RqRacqueteerSubscriptionsFields' ),
        'AcfRacqueteerTestimonialsBlock'        => array( 'field' => 'racqueteerTestimonials',        'type' => 'RqRacqueteerTestimonialsFields' ),
        // NOTE: AcfRacqueteerEventsBlock uses a custom resolver below (what_includes repeater) — skip here
        'AcfRacqueteerMembershipHeroBlock'      => array( 'field' => 'racqueteerMembershipHero',      'type' => 'RqRacqueteerMembershipHeroFields' ),
        'AcfRacqueteerSubscriptionsDetailBlock' => array( 'field' => 'racqueteerSubscriptionsDetail', 'type' => 'RqRacqueteerSubscriptionsDetailFields' ),
        'AcfRacqueteerPriceCompareBlock'        => array( 'field' => 'racqueteerPriceCompare',        'type' => 'RqRacqueteerPriceCompareFields' ),
        // NOTE: AcfRacqueteerPrivateEventsHeroBlock uses a custom resolver below (what_includes repeater) — skip here
        'AcfRacqueteerGalleryBlock'             => array( 'field' => 'racqueteerGallery',             'type' => 'RqRacqueteerGalleryFields' ),
        'AcfRacqueteerLogoMarqueeBlock'         => array( 'field' => 'racqueteerLogoMarquee',         'type' => 'RqRacqueteerLogoMarqueeFields' ),
        'AcfRacqueteerAboutHeroBlock'           => array( 'field' => 'racqueteerAboutHero',           'type' => 'RqRacqueteerAboutHeroFields' ),
        'AcfRacqueteerMissionBlock'             => array( 'field' => 'racqueteerMission',             'type' => 'RqRacqueteerMissionFields' ),
        'AcfRacqueteerContactBlock'             => array( 'field' => 'racqueteerContact',             'type' => 'RqRacqueteerContactFields' ),
        'AcfRacqueteerCareersHeroBlock'         => array( 'field' => 'racqueteerCareersHero',         'type' => 'RqRacqueteerCareersHeroFields' ),
        'AcfRacqueteerJobListingsBlock'         => array( 'field' => 'racqueteerJobListings',         'type' => 'RqRacqueteerJobListingsFields' ),
        'AcfRacqueteerCareerContactBlock'       => array( 'field' => 'racqueteerCareerContact',       'type' => 'RqRacqueteerCareerContactFields' ),
    );

    // Набори ключів зображень — використовуються у closure резолвера нижче.
    // single_image: скалярний attachment ID → рядок URL (return_format:'url')
    // gallery_url:  масив ID → JSON-масив рядків URL (return_format:'url')
    // gallery_arr:  масив ID → JSON-масив об'єктів {id,url,sourceUrl} (return_format:'array')
    $rq_single_image_keys  = array( 'left_image', 'right_image', 'bg_image', 'image' );
    $rq_gallery_url_keys   = array( 'images' );
    $rq_gallery_array_keys = array( 'logos' );

    foreach ( $block_field_map as $block_type => $info ) {
        try {
            register_graphql_field( $block_type, $info['field'], array(
                'type'    => $info['type'],
                'resolve' => function ( $source ) use ( $rq_single_image_keys, $rq_gallery_url_keys, $rq_gallery_array_keys ) {
                    $raw = isset( $source['attrs']['data'] ) ? $source['attrs']['data']
                         : ( isset( $source['attrs'] ) ? $source['attrs']
                         : ( isset( $source['data'] ) ? $source['data'] : $source ) );
                    if ( ! is_array( $raw ) ) {
                        return array();
                    }
                    $out = array();
                    foreach ( $raw as $k => $v ) {
                        $k = (string) $k;
                        if ( '' !== $k && '_' === $k[0] ) {
                            continue; // пропустити внутрішні мета-ключі ACF, наприклад _left_image
                        }
                        // snake_case → camelCase
                        $words = explode( '_', $k );
                        $camel = strtolower( $words[0] );
                        for ( $i = 1, $n = count( $words ); $i < $n; $i++ ) {
                            $camel .= ucfirst( strtolower( $words[ $i ] ) );
                        }

                        // ── Одиночне зображення: attachment ID → рядок URL ─────────────────────────
                        if ( in_array( $k, $rq_single_image_keys, true ) ) {
                            if ( is_numeric( $v ) && (int) $v > 0 ) {
                                $url = wp_get_attachment_url( (int) $v );
                                $out[ $camel ] = $url ?: (string) $v;
                            } else {
                                $out[ $camel ] = is_string( $v ) ? $v : '';
                            }
                            continue;
                        }

                        // ── Галерея (return_format:'url'): масив ID → JSON-масив URL ─
                        if ( in_array( $k, $rq_gallery_url_keys, true ) && is_array( $v ) ) {
                            $urls = array();
                            foreach ( $v as $id ) {
                                if ( is_numeric( $id ) && (int) $id > 0 ) {
                                    $url = wp_get_attachment_url( (int) $id );
                                    if ( $url ) { $urls[] = $url; }
                                } elseif ( is_string( $id ) && '' !== $id ) {
                                    $urls[] = $id; // вже є URL
                                }
                            }
                            $out[ $camel ] = json_encode( $urls, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
                            continue;
                        }

                        // ── Галерея (return_format:'array'): ID → JSON-масив об'єктів ─────
                        if ( in_array( $k, $rq_gallery_array_keys, true ) && is_array( $v ) ) {
                            $objects = array();
                            foreach ( $v as $id ) {
                                if ( is_numeric( $id ) && (int) $id > 0 ) {
                                    $url = wp_get_attachment_url( (int) $id );
                                    if ( $url ) {
                                        $objects[] = array( 'id' => (int) $id, 'url' => $url, 'sourceUrl' => $url );
                                    }
                                } elseif ( is_array( $id ) && ! empty( $id['url'] ) ) {
                                    $objects[] = array(
                                        'id'        => isset( $id['ID'] ) ? (int) $id['ID'] : 0,
                                        'url'       => $id['url'],
                                        'sourceUrl' => $id['url'],
                                    );
                                }
                            }
                            $out[ $camel ] = json_encode( $objects, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
                            continue;
                        }

                        // ── За замовчуванням: JSON-кодувати масиви; scalars передавати як є ────────────
                        $out[ $camel ] = is_array( $v ) ? json_encode( $v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) : $v;
                    }
                    return $out;
                },
            ) );
        } catch ( \Throwable $e ) {
            // Поле вже існує (зареєстровано WPGraphQL for ACF) — ігнорувати
        }
    }

    // ── AcfRacqueteerEventsBlock — custom resolver (what_includes repeater) ─────────────────
    try {
        register_graphql_field( 'AcfRacqueteerEventsBlock', 'racqueteerEvents', array(
            'type'    => 'RqRacqueteerEventsFields',
            'resolve' => function ( $source ) use ( $rq_single_image_keys ) {
                $raw = isset( $source['attrs']['data'] ) ? $source['attrs']['data']
                     : ( isset( $source['attrs'] ) ? $source['attrs']
                     : ( isset( $source['data']  ) ? $source['data']  : $source ) );

                if ( ! is_array( $raw ) ) {
                    return array( 'title' => '', 'description' => '', 'ctaText' => '', 'ctaUrl' => '', 'image' => '', 'whatIncludes' => '[]' );
                }

                // Resolve image attachment ID → URL
                $image_val = isset( $raw['image'] ) ? $raw['image'] : '';
                if ( is_numeric( $image_val ) && (int) $image_val > 0 ) {
                    $image_val = wp_get_attachment_url( (int) $image_val ) ?: '';
                }

                $out = array(
                    'title'       => isset( $raw['title'] )       ? (string) $raw['title']       : '',
                    'description' => isset( $raw['description'] ) ? (string) $raw['description'] : '',
                    'ctaText'     => isset( $raw['cta_text'] )    ? (string) $raw['cta_text']    : '',
                    'ctaUrl'      => isset( $raw['cta_url'] )     ? (string) $raw['cta_url']     : '',
                    'image'       => (string) $image_val,
                );

                // Rebuild what_includes repeater from numbered flat keys
                $count = (int) ( isset( $raw['what_includes'] ) ? $raw['what_includes'] : 0 );
                $items = array();
                for ( $i = 0; $i < $count; $i++ ) {
                    $icon = isset( $raw[ "what_includes_{$i}_icon" ] ) ? $raw[ "what_includes_{$i}_icon" ] : '';
                    if ( is_array( $icon ) ) { $icon = $icon[0] ?? ''; }
                    $items[] = array(
                        'text' => isset( $raw[ "what_includes_{$i}_text" ] ) ? (string) $raw[ "what_includes_{$i}_text" ] : '',
                        'icon' => strtolower( trim( (string) $icon ) ),
                    );
                }

                $out['whatIncludes'] = json_encode( $items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
                return $out;
            },
        ) );
    } catch ( \Throwable $e ) {}

    // ── AcfRacqueteerPrivateEventsHeroBlock — custom resolver (what_includes repeater) ─────────────────
    // The standard flat resolver cannot reconstruct ACF repeater data stored as numbered keys
    // (what_includes_0_text, what_includes_0_icon, …). This custom resolver rebuilds the items
    // and JSON-encodes them; PrivateEventsHeroBlock.tsx parses via JSON.parse(attrs.whatIncludes).
    try {
        register_graphql_field( 'AcfRacqueteerPrivateEventsHeroBlock', 'racqueteerPrivateEventsHero', array(
            'type'    => 'RqRacqueteerPrivateEventsHeroFields',
            'resolve' => function ( $source ) {
                $raw = isset( $source['attrs']['data'] ) ? $source['attrs']['data']
                     : ( isset( $source['attrs'] ) ? $source['attrs']
                     : ( isset( $source['data']  ) ? $source['data']  : $source ) );

                if ( ! is_array( $raw ) ) {
                    return array( 'label' => '', 'title' => '', 'description' => '', 'ctaText' => '', 'ctaUrl' => '', 'videoUrl' => '', 'whatIncludes' => '[]' );
                }

                $out = array(
                    'label'       => isset( $raw['label'] )       ? (string) $raw['label']       : '',
                    'title'       => isset( $raw['title'] )       ? (string) $raw['title']       : '',
                    'description' => isset( $raw['description'] ) ? (string) $raw['description'] : '',
                    'ctaText'     => isset( $raw['cta_text'] )    ? (string) $raw['cta_text']    : '',
                    'ctaUrl'      => isset( $raw['cta_url'] )     ? (string) $raw['cta_url']     : '',
                    'videoUrl'    => isset( $raw['video_url'] )   ? (string) $raw['video_url']   : '',
                );

                // Rebuild what_includes repeater from numbered flat keys
                $count = (int) ( isset( $raw['what_includes'] ) ? $raw['what_includes'] : 0 );
                $items = array();

                for ( $i = 0; $i < $count; $i++ ) {
                    $icon = isset( $raw[ "what_includes_{$i}_icon" ] ) ? $raw[ "what_includes_{$i}_icon" ] : '';
                    if ( is_array( $icon ) ) { $icon = $icon[0] ?? ''; }
                    $items[] = array(
                        'text' => isset( $raw[ "what_includes_{$i}_text" ] ) ? (string) $raw[ "what_includes_{$i}_text" ] : '',
                        'icon' => strtolower( trim( (string) $icon ) ),
                    );
                }

                $out['whatIncludes'] = json_encode( $items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
                return $out;
            },
        ) );
    } catch ( \Throwable $e ) {
        // Ignore duplicate registration
    }

    // ── AcfRacqueteerAmenitiesBlock — custom resolver (repeater rebuild) ─────────────────    // The standard resolver cannot reconstruct an ACF repeater stored as numbered keys
    // (amenities_0_title, amenities_1_number, …). This custom resolver rebuilds the array
    // and JSON-encodes it so AmenitiesBlock.tsx can parse it via JSON.parse(attrs.amenities).
    try {
        register_graphql_field( 'AcfRacqueteerAmenitiesBlock', 'racqueteerAmenities', array(
            'type'    => 'RqRacqueteerAmenitiesFields',
            'resolve' => function ( $source ) {
                $raw = isset( $source['attrs']['data'] ) ? $source['attrs']['data']
                     : ( isset( $source['attrs'] ) ? $source['attrs']
                     : ( isset( $source['data']  ) ? $source['data']  : $source ) );

                if ( ! is_array( $raw ) ) {
                    return array( 'label' => '', 'title' => '', 'amenities' => '[]' );
                }

                $label = isset( $raw['label'] ) ? (string) $raw['label'] : '';
                $title = isset( $raw['title'] ) ? (string) $raw['title'] : '';

                // Rebuild ACF repeater from numbered inline-block keys
                $count = (int) ( isset( $raw['amenities'] ) ? $raw['amenities'] : 0 );
                $items = array();

                for ( $i = 0; $i < $count; $i++ ) {
                    // Images: array of attachment IDs → resolve to URLs
                    $raw_images = isset( $raw[ "amenities_{$i}_images" ] ) ? $raw[ "amenities_{$i}_images" ] : array();
                    $images     = array();
                    if ( is_array( $raw_images ) ) {
                        foreach ( $raw_images as $img_id ) {
                            if ( is_numeric( $img_id ) && (int) $img_id > 0 ) {
                                $url = wp_get_attachment_url( (int) $img_id );
                                if ( $url ) { $images[] = $url; }
                            } elseif ( is_string( $img_id ) && '' !== $img_id ) {
                                $images[] = $img_id;
                            }
                        }
                    }

                    $items[] = array(
                        'title'        => isset( $raw[ "amenities_{$i}_title" ]            ) ? (string) $raw[ "amenities_{$i}_title" ]            : '',
                        'number'       => isset( $raw[ "amenities_{$i}_number" ]           ) ? (string) $raw[ "amenities_{$i}_number" ]           : '',
                        'imageLayout'  => isset( $raw[ "amenities_{$i}_image_layout" ]     ) ? (string) $raw[ "amenities_{$i}_image_layout" ]     : 'single',
                        'images'       => $images,
                        'feature1Icon' => isset( $raw[ "amenities_{$i}_feature_1_icon" ]   ) ? (string) $raw[ "amenities_{$i}_feature_1_icon" ]   : '',
                        'feature1Text' => isset( $raw[ "amenities_{$i}_feature_1_text" ]   ) ? (string) $raw[ "amenities_{$i}_feature_1_text" ]   : '',
                        'feature2Icon' => isset( $raw[ "amenities_{$i}_feature_2_icon" ]   ) ? (string) $raw[ "amenities_{$i}_feature_2_icon" ]   : '',
                        'feature2Text' => isset( $raw[ "amenities_{$i}_feature_2_text" ]   ) ? (string) $raw[ "amenities_{$i}_feature_2_text" ]   : '',
                    );
                }

                return array(
                    'label'     => $label,
                    'title'     => $title,
                    'amenities' => json_encode( $items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ),
                );
            },
        ) );
    } catch ( \Throwable $e ) {
        // Ignore duplicate registration
    }

}, 5 );

// ═════════════════════════════════════════════════════════════════════════════
// Navbar + Footer options — ручний fallback (пропускається для WPGraphQL for ACF v4+)
//
// Priority 5 (те саме що поля блоків), щоб зареєструватись ДО WPGraphQL for ACF
// (priority 10). Якщо WPGraphQL for ACF спробує повторно зареєструвати acfOptionsNavbar /
// acfOptionsFooter — мовчки не спрацює. Наш резолвер перемагає та
// коректно викликає get_field() для конвертації attachment ID зображень лого у URL.
// ═════════════════════════════════════════════════════════════════════════════
add_action( 'graphql_register_types', function () {
    if ( ! function_exists( 'register_graphql_field' )
         || ! function_exists( 'register_graphql_object_type' ) ) {
        return;
    }

    // Пропустити для WPGraphQL for ACF v4.x — він реєструє ці поля автоматично
    if ( defined( 'WPGRAPHQL_FOR_ACF_VERSION' )
        && version_compare( WPGRAPHQL_FOR_ACF_VERSION, '4.0.0', '>=' ) ) {
        return;
    }

    $type_exists = function ( $name ) {
        try {
            if ( class_exists( '\WPGraphQL' ) && method_exists( '\WPGraphQL', 'get_type_registry' ) ) {
                $reg = \WPGraphQL::get_type_registry();
                if ( $reg && method_exists( $reg, 'get_registered_type' ) ) {
                    return (bool) $reg->get_registered_type( $name );
                }
            }
        } catch ( \Throwable $ignored ) {}
        return false;
    };

    if ( ! $type_exists( 'RqNavLink' ) ) {
        register_graphql_object_type( 'RqNavLink', array(
            'description' => 'Елемент навігаційного посилання',
            'fields'      => array(
                'label' => array( 'type' => 'String' ),
                'url'   => array( 'type' => 'String' ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqImageRef' ) ) {
        register_graphql_object_type( 'RqImageRef', array(
            'description' => 'Посилання на зображення',
            'fields'      => array(
                'sourceUrl' => array( 'type' => 'String' ),
                'altText'   => array( 'type' => 'String' ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqFooterLocation' ) ) {
        register_graphql_object_type( 'RqFooterLocation', array(
            'description' => 'Локація у футері',
            'fields'      => array(
                'name'    => array( 'type' => 'String' ),
                'address' => array( 'type' => 'String' ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqNavbarFields' ) ) {
        register_graphql_object_type( 'RqNavbarFields', array(
            'description' => 'Поля ACF Navbar options',
            'fields'      => array(
                'navLogo'     => array( 'type' => 'RqImageRef' ),
                'navLogoIcon' => array( 'type' => 'RqImageRef' ),
                'navLinks'    => array( 'type' => array( 'list_of' => 'RqNavLink' ) ),
                'navCtaText'  => array( 'type' => 'String' ),
                'navCtaUrl'   => array( 'type' => 'String' ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqNavbarWrapper' ) ) {
        register_graphql_object_type( 'RqNavbarWrapper', array(
            'description' => 'Обгортка для acfOptionsNavbar',
            'fields'      => array(
                'navbar' => array(
                    'type'    => 'RqNavbarFields',
                    'resolve' => function () {
                        if ( ! function_exists( 'get_field' ) ) { return null; }
                        $logo      = get_field( 'field_nav_logo', 'options' );
                        $icon      = get_field( 'field_nav_logo_icon', 'options' );
                        $nav_links = get_field( 'field_nav_links', 'options' );
                        if ( ! is_array( $nav_links ) ) { $nav_links = array(); }
                        return array(
                            'navLogo'     => $logo ? array( 'sourceUrl' => isset( $logo['url'] ) ? $logo['url'] : '', 'altText' => isset( $logo['alt'] ) ? $logo['alt'] : '' ) : null,
                            'navLogoIcon' => $icon ? array( 'sourceUrl' => isset( $icon['url'] ) ? $icon['url'] : '', 'altText' => isset( $icon['alt'] ) ? $icon['alt'] : '' ) : null,
                            'navLinks'    => array_map( function ( $l ) { return array( 'label' => isset( $l['label'] ) ? $l['label'] : '', 'url' => isset( $l['url'] ) ? $l['url'] : '' ); }, $nav_links ),
                            'navCtaText'  => (string) get_field( 'field_nav_cta_text', 'options' ),
                            'navCtaUrl'   => (string) get_field( 'field_nav_cta_url',  'options' ),
                        );
                    },
                ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqFooterFields' ) ) {
        register_graphql_object_type( 'RqFooterFields', array(
            'description' => 'Поля ACF Footer options',
            'fields'      => array(
                'footerLogo'       => array( 'type' => 'RqImageRef' ),
                'footerEmail'      => array( 'type' => 'String' ),
                'footerPhone'      => array( 'type' => 'String' ),
                'footerCtaText'    => array( 'type' => 'String' ),
                'footerCtaUrl'     => array( 'type' => 'String' ),
                'footerMenuLinks'  => array( 'type' => array( 'list_of' => 'RqNavLink' ) ),
                'footerLocations'  => array( 'type' => array( 'list_of' => 'RqFooterLocation' ) ),
                'footerCopyright'  => array( 'type' => 'String' ),
                'footerLegalLinks' => array( 'type' => array( 'list_of' => 'RqNavLink' ) ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqFooterWrapper' ) ) {
        register_graphql_object_type( 'RqFooterWrapper', array(
            'description' => 'Обгортка для acfOptionsFooter',
            'fields'      => array(
                'footer' => array(
                    'type'    => 'RqFooterFields',
                    'resolve' => function () {
                        if ( ! function_exists( 'get_field' ) ) { return null; }
                        $logo        = get_field( 'field_footer_logo',        'options' );
                        $menu_links  = get_field( 'field_footer_menu_links',  'options' );
                        $locations   = get_field( 'field_footer_locations',   'options' );
                        $legal_links = get_field( 'field_footer_legal_links', 'options' );
                        if ( ! is_array( $menu_links )  ) { $menu_links  = array(); }
                        if ( ! is_array( $locations )   ) { $locations   = array(); }
                        if ( ! is_array( $legal_links ) ) { $legal_links = array(); }
                        $map_link = function ( $l ) { return array( 'label' => isset( $l['label'] ) ? $l['label'] : '', 'url' => isset( $l['url'] ) ? $l['url'] : '' ); };
                        return array(
                            'footerLogo'       => $logo ? array( 'sourceUrl' => isset( $logo['url'] ) ? $logo['url'] : '', 'altText' => isset( $logo['alt'] ) ? $logo['alt'] : '' ) : null,
                            'footerEmail'      => (string) get_field( 'field_footer_email',     'options' ),
                            'footerPhone'      => (string) get_field( 'field_footer_phone',     'options' ),
                            'footerCtaText'    => (string) get_field( 'field_footer_cta_text',  'options' ),
                            'footerCtaUrl'     => (string) get_field( 'field_footer_cta_url',   'options' ),
                            'footerMenuLinks'  => array_map( $map_link, $menu_links ),
                            'footerLocations'  => array_map( function ( $l ) { return array( 'name' => isset( $l['name'] ) ? $l['name'] : '', 'address' => isset( $l['address'] ) ? $l['address'] : '' ); }, $locations ),
                            'footerCopyright'  => (string) get_field( 'field_footer_copyright', 'options' ),
                            'footerLegalLinks' => array_map( $map_link, $legal_links ),
                        );
                    },
                ),
            ),
        ) );
    }

    try {
        register_graphql_field( 'RootQuery', 'acfOptionsNavbar', array(
            'type'        => 'RqNavbarWrapper',
            'description' => 'ACF Navbar options',
            'resolve'     => function () { return array(); },
        ) );
    } catch ( \Throwable $e ) {}

    try {
        register_graphql_field( 'RootQuery', 'acfOptionsFooter', array(
            'type'        => 'RqFooterWrapper',
            'description' => 'ACF Footer options',
            'resolve'     => function () { return array(); },
        ) );
    } catch ( \Throwable $e ) {}

    // ── Book Modal options ────────────────────────────────────────────────────
    if ( ! $type_exists( 'RqBookModalSportImage' ) ) {
        register_graphql_object_type( 'RqBookModalSportImage', array(
            'description' => 'Зображення спорту для Book Modal',
            'fields'      => array(
                'sourceUrl' => array( 'type' => 'String' ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqBookModalFields' ) ) {
        register_graphql_object_type( 'RqBookModalFields', array(
            'description' => 'Поля ACF Book Modal options',
            'fields'      => array(
                'modalTitle'       => array( 'type' => 'String' ),
                'modalSubtitle'    => array( 'type' => 'String' ),
                'sport1Title'      => array( 'type' => 'String' ),
                'sport1Image'      => array( 'type' => 'RqBookModalSportImage' ),
                'sport1ButtonText' => array( 'type' => 'String' ),
                'sport1BookingUrl' => array( 'type' => 'String' ),
                'sport2Title'      => array( 'type' => 'String' ),
                'sport2Image'      => array( 'type' => 'RqBookModalSportImage' ),
                'sport2ButtonText' => array( 'type' => 'String' ),
                'sport2BookingUrl' => array( 'type' => 'String' ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqBookModalWrapper' ) ) {
        register_graphql_object_type( 'RqBookModalWrapper', array(
            'description' => 'Обгортка для acfOptionsBookModal',
            'fields'      => array(
                'bookModal' => array(
                    'type'    => 'RqBookModalFields',
                    'resolve' => function () {
                        if ( ! function_exists( 'get_field' ) ) { return null; }
                        $resolve_sport_image = function ( $field_key ) {
                            $img = get_field( $field_key, 'options' );
                            if ( ! $img ) { return null; }
                            // return_format: array → has 'url' key
                            if ( is_array( $img ) ) {
                                return array( 'sourceUrl' => isset( $img['url'] ) ? $img['url'] : ( isset( $img['sourceUrl'] ) ? $img['sourceUrl'] : '' ) );
                            }
                            // return_format: url → plain string
                            if ( is_string( $img ) && '' !== $img ) {
                                return array( 'sourceUrl' => $img );
                            }
                            // attachment ID
                            if ( is_numeric( $img ) && (int) $img > 0 ) {
                                $url = wp_get_attachment_url( (int) $img );
                                return $url ? array( 'sourceUrl' => $url ) : null;
                            }
                            return null;
                        };
                        return array(
                            'modalTitle'       => (string) get_field( 'field_bm_modal_title',     'options' ),
                            'modalSubtitle'    => (string) get_field( 'field_bm_modal_subtitle',  'options' ),
                            'sport1Title'      => (string) get_field( 'field_bm_sport1_title',    'options' ),
                            'sport1Image'      => $resolve_sport_image( 'field_bm_sport1_image' ),
                            'sport1ButtonText' => (string) get_field( 'field_bm_sport1_btn_text', 'options' ),
                            'sport1BookingUrl' => (string) get_field( 'field_bm_sport1_url',      'options' ),
                            'sport2Title'      => (string) get_field( 'field_bm_sport2_title',    'options' ),
                            'sport2Image'      => $resolve_sport_image( 'field_bm_sport2_image' ),
                            'sport2ButtonText' => (string) get_field( 'field_bm_sport2_btn_text', 'options' ),
                            'sport2BookingUrl' => (string) get_field( 'field_bm_sport2_url',      'options' ),
                        );
                    },
                ),
            ),
        ) );
    }
    try {
        register_graphql_field( 'RootQuery', 'acfOptionsBookModal', array(
            'type'        => 'RqBookModalWrapper',
            'description' => 'ACF Book Modal options',
            'resolve'     => function () { return array(); },
        ) );
    } catch ( \Throwable $e ) {}

}, 5 );

// ═════════════════════════════════════════════════════════════════════════════
// Strategy H — Перевизначення резолвера під час виконання для Page.blocks (v18)
//
// Проблема: резолвер Page.blocks від WPGraphQL Content Blocks повертає лише блоки,
// що є у його власному внутрішньому реєстрі (побудованому з WP Block Registry НА МОМЕНТ
// ініціалізації Content Blocks). Коли Content Blocks обробляє реєстр,
// тип блоку `acf/racqueteer-hero` ЄА у WP_Block_Type_Registry (зареєстровано через
// acf_register_block_type → register_block_type в acf/init), але Content Blocks
// може пропустити його, оскільки його власний тип `AcfRacqueteerHeroBlock` вже
// зареєстровано WPGraphQL for ACF → дублікат → Content Blocks виключає
// маппінг `acf/racqueteer-hero` → AcfRacqueteerHeroBlock зі своєї таблиці пошуку
// → повертає 0 блоків під час виконання, хоча схема коректна.
//
// Рішення: зачіпатись у graphql_resolve_field ПІСЛЯ виконання резолвера. Якщо `blocks`
// повернув порожній масив, замінюємо його власним результатом parse_blocks(),
// відображаючи кожну назву блоку `acf/*` на правильний тип GraphQL. Наявні
// резолвери flat Rq*Fields (зареєстровані нижче з priority 5) читають з
// $source['attrs']['data'] — саме там ACF зберігає значення полів всередині
// коментаря Gutenberg-блоку — тому всі дані ACF-полів проходять автоматично.
// ═════════════════════════════════════════════════════════════════════════════
add_filter( 'graphql_resolve_field', function ( $result, $source, $args, $context, $info, $type_name, $field_key, $type, $field ) {

    // Перехоплювати лише поле `blocks` (не editorBlocks чи інші поля)
    if ( 'blocks' !== $field_key ) {
        return $result;
    }

    // Діяти лише на типах Page / Post / подібних типах контенту
    $content_types = array( 'Page', 'Post', 'NodeWithContentEditor' );
    if ( ! in_array( $type_name, $content_types, true ) ) {
        return $result;
    }

    // Замінювати лише якщо результат порожній (не перевизначати робочий резолвер)
    if ( ! empty( $result ) ) {
        return $result;
    }

    // Маппінг назви WP-блоку → назви типу GraphQL
    static $block_type_map = null;
    if ( null === $block_type_map ) {
        $block_type_map = array(
            'acf/racqueteer-hero'                  => 'AcfRacqueteerHeroBlock',
            'acf/racqueteer-about'                 => 'AcfRacqueteerAboutBlock',
            'acf/racqueteer-locations'             => 'AcfRacqueteerLocationsBlock',
            'acf/racqueteer-amenities'             => 'AcfRacqueteerAmenitiesBlock',
            'acf/racqueteer-programs'              => 'AcfRacqueteerProgramsBlock',
            'acf/racqueteer-membership-cta'        => 'AcfRacqueteerMembershipCtaBlock',
            'acf/racqueteer-subscriptions'         => 'AcfRacqueteerSubscriptionsBlock',
            'acf/racqueteer-testimonials'          => 'AcfRacqueteerTestimonialsBlock',
            'acf/racqueteer-events'                => 'AcfRacqueteerEventsBlock',
            'acf/racqueteer-membership-hero'       => 'AcfRacqueteerMembershipHeroBlock',
            'acf/racqueteer-subscriptions-detail'  => 'AcfRacqueteerSubscriptionsDetailBlock',
            'acf/racqueteer-price-compare'         => 'AcfRacqueteerPriceCompareBlock',
            'acf/racqueteer-private-events-hero'   => 'AcfRacqueteerPrivateEventsHeroBlock',
            'acf/racqueteer-gallery'               => 'AcfRacqueteerGalleryBlock',
            'acf/racqueteer-logo-marquee'          => 'AcfRacqueteerLogoMarqueeBlock',
            'acf/racqueteer-about-hero'            => 'AcfRacqueteerAboutHeroBlock',
            'acf/racqueteer-mission'               => 'AcfRacqueteerMissionBlock',
            'acf/racqueteer-contact'               => 'AcfRacqueteerContactBlock',
            'acf/racqueteer-careers-hero'          => 'AcfRacqueteerCareersHeroBlock',
            'acf/racqueteer-job-listings'          => 'AcfRacqueteerJobListingsBlock',
            'acf/racqueteer-career-contact'        => 'AcfRacqueteerCareerContactBlock',
        );
    }

    try {
        // Отримати сирий об'єкт WP_Post з моделі WPGraphQL
        $post_id = null;
        if ( is_object( $source ) ) {
            $post_id = isset( $source->databaseId ) ? (int) $source->databaseId
                     : ( isset( $source->ID )       ? (int) $source->ID : null );
        } elseif ( is_array( $source ) ) {
            $post_id = isset( $source['databaseId'] ) ? (int) $source['databaseId']
                     : ( isset( $source['ID'] )       ? (int) $source['ID'] : null );
        }

        if ( ! $post_id ) {
            return $result;
        }

        $post = get_post( $post_id );
        if ( ! $post || empty( $post->post_content ) ) {
            return $result;
        }

        if ( ! function_exists( 'parse_blocks' ) ) {
            return $result;
        }

        $raw_blocks  = parse_blocks( $post->post_content );
        $resolved    = array();
        $type_names  = array();

            foreach ( $raw_blocks as $raw ) {
                $block_name = isset( $raw['blockName'] ) ? $raw['blockName'] : '';
                if ( empty( $block_name ) || ! isset( $block_type_map[ $block_name ] ) ) {
                    continue; // пропустити не-ACF або пробільні блоки
                }

            $type_name_block = $block_type_map[ $block_name ];
            $attrs           = isset( $raw['attrs'] ) ? $raw['attrs'] : array();
            $block_id        = isset( $attrs['id'] ) ? $attrs['id']
                             : ( 'block_' . md5( $block_name . wp_json_encode( $attrs ) ) );

            $resolved[]   = array(
                '__typename'  => $type_name_block,
                'blockName'   => $block_name,
                'id'          => $block_id,
                'type'        => $block_name,
                'tagName'     => 'div',
                'innerHtml'   => isset( $raw['innerHTML'] ) ? $raw['innerHTML'] : '',
                // ACF field resolver reads from attrs.data (set during import)
                // Резолвер ACF-полів читає з attrs.data (встановлюється під час імпорту)
                'attrs'       => $attrs,
                'data'        => isset( $attrs['data'] ) ? $attrs['data'] : array(),
                'innerBlocks' => isset( $raw['innerBlocks'] ) ? $raw['innerBlocks'] : array(),
            );
            $type_names[] = $type_name_block;
        }

        // Зберегти діагностичну інформацію (споживається діагностикою rq_verify_graphql)
        update_option( 'rq_diag_blocks_resolver', array(
            'post_id'     => $post_id,
            'content_len' => strlen( $post->post_content ),
            'raw_count'   => count( $raw_blocks ),
            'acf_count'   => count( $resolved ),
            'types'       => $type_names,
        ), false );

        return $resolved;

    } catch ( \Throwable $e ) {
        update_option( 'rq_diag_blocks_resolver', 'err:' . $e->getMessage(), false );
        return $result;
    }

}, 10, 9 );

// ── passthrough no-op (збережено для сумісності) ───────────────────────────
add_filter( 'graphql_connection_query_args', function ( $args ) {
    return $args;
} );
