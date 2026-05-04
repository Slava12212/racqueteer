<?php
/**
 * GraphQL Extensions — v19
 * Racqueteer headless theme — WPGraphQL schema customisations.
 *
 * Changelog v18:
 * - ROOT FIX (runtime) — Strategy H: graphql_resolve_field filter intercepts the `blocks`
 *   field on Page/Post types.  When WPGraphQL Content Blocks resolver returns 0 blocks
 *   (because it doesn't recognise `acf/*` block names in its own registry), our filter fires
 *   AFTER the resolver, sees an empty result, and replaces it with blocks parsed directly from
 *   `post_content` via WordPress's own `parse_blocks()`.
 *
 *   Each parsed block is returned as a PHP array with:
 *     __typename → AcfRacqueteer*Block   (used by graphql-php for type dispatch)
 *     id / type / tagName / innerHtml    (required Block interface fields)
 *     attrs                              (raw Gutenberg block attributes)
 *
 *   The existing `racqueteerHero` / `racqueteerAbout` … resolvers (registered in the
 *   Flat Rq*Fields section below) read `$source['attrs']['data']` — exactly what ACF
 *   stores in the Gutenberg block comment — so ACF field data is returned automatically.
 *
 *   A `rq_diag_blocks_resolver` wp_option is written on every Page.blocks resolution for
 *   diagnostic purposes (post_id, content_len, raw_count, acf_count, types).
 *
 * - Sentinel: v18.
 * v17: Strategy G (pre-register Block/EditorBlock at priority 1) — schema fixed.
 * v16: Strategy E priority 1 fix (insufficient — eager type construction beats it).
 * - ROOT FIX — Strategy G: Pre-register Block + EditorBlock interfaces at priority 1 of
 *   graphql_register_types, BEFORE WPGraphQL for ACF builds AcfRacqueteer*Block ObjectTypes
 *   at priority 10.
 *
 *   WHY v16 still failed:
 *   WPGraphQL for ACF v2.6.0 constructs WPObjectType instances EAGERLY inside register_type()
 *   (called at priority 10). The WPObjectType constructor resolves string interface names via
 *   TypeRegistry::get_type(). At priority 10, WPGraphQL Content Blocks has NOT yet registered
 *   Block/EditorBlock (it does so at priority 100+), so get_type('Block') → null → interfaces
 *   array is empty after construction → final schema: Interfaces: none.
 *
 *   Strategy E (register_graphql_interfaces_to_types at priority 1) queues a callback at
 *   priority 10 calling register_extra_interface(). This fires at the SAME priority 10 as ACF
 *   block type construction, but the internal callback timing (FIFO order within priority 10)
 *   is uncertain and the property extra_type_interfaces was not found by reflection — confirming
 *   the mechanism wasn't working in this WPGraphQL version.
 *
 *   Strategy G solution:
 *   At priority 1 (fires before priority 10), we pre-register Block and EditorBlock interfaces
 *   with the exact fields Content Blocks uses (id, type, tagName, innerHtml, attributes,
 *   connections) plus a resolveType that converts blockName → GraphQL type name. When ACF
 *   block types are built at priority 10, TypeRegistry::get_type('Block') now returns our stub
 *   → Block IS in the interfaces array → Page.blocks returns all ACF blocks.
 *
 *   WPGraphQL TypeRegistry ignores duplicate registrations (no-op when type already exists),
 *   so Content Blocks' Block/EditorBlock registration at priority 100 is silently skipped —
 *   our stubs remain authoritative.
 *
 * - Sentinel: v17.
 * v16: Strategy E priority 1 fix (insufficient — eager type construction beats it).
 * v15: Strategy F graphql_schema_config direct injection (HTTP 500 — readonly PHP 8.1 props).
 * v14: Strategy C priority 9→100. Strategy E: register_graphql_interfaces_to_types.
 * v13: diagnostics for TypeRegistry interfaces.
 * v12: added attributes:Attribute + connections:[PostObjectUnion].
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ── PHP Fatal capture → wp_options ──────────────────────────────────────────
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

// ── Admin notices ─────────────────────────────────────────────────────────────
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

// ── WPGraphQL: increase max query depth ──────────────────────────────────────
add_filter( 'graphql_query_max_depth', function () {
    return 20;
} );

// ═════════════════════════════════════════════════════════════════════════════
// BLOCK INTERFACE INJECTION — v17 approach
//
// Goal: make all AcfRacqueteer*Block types implement the Block interface
// so WPGraphQL Content Blocks includes them in Page.blocks results.
//
// Strategy G: pre-register Block + EditorBlock at PRIORITY 1 ← MAIN FIX v17
// Strategy A: wpgraphql_acf_block_type_config — WPGraphQL for ACF native hook
// Strategy B: graphql_wp_object_type_config — schema build time, pattern match
// Strategy C: priority 100 — fallback registration for types ACF missed
// Strategy E: register_graphql_interfaces_to_types at PRIORITY 1 (belt-and-suspenders)
// ═════════════════════════════════════════════════════════════════════════════

// Block type names used across strategies
$rq_acf_block_names = array(
    'AcfRacqueteerHeroBlock',
    'AcfRacqueteerAboutBlock',
    'AcfRacqueteerLocationsBlock',
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

// ── Strategy A: WPGraphQL for ACF native filter ───────────────────────────
add_filter( 'wpgraphql_acf_block_type_config', function ( $config ) {
    if ( ! is_array( $config ) ) {
        return $config;
    }
    $interfaces = isset( $config['interfaces'] ) ? (array) $config['interfaces'] : array();
    if ( ! in_array( 'Block', $interfaces, true ) ) {
        $interfaces[] = 'Block';
    }
    // EditorBlock is optional in some WPGraphQL Content Blocks builds.
    // Avoid forcing a possibly-missing interface at this early stage.
    $config['interfaces'] = $interfaces;
    update_option( 'rq_diag_strategy_a', 'fired:' . ( isset( $config['name'] ) ? $config['name'] : 'unknown' ), false );
    return $config;
}, 5 );

// Alternative filter name used by some ACF/WPGraphQL versions
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
// ── Strategy G: Pre-register Block + EditorBlock interfaces ──────────────────
//
// Fires at priority 1 — BEFORE WPGraphQL for ACF builds ACF block ObjectTypes at priority 10.
//
// Problem: WPGraphQL for ACF v2.6.0 constructs WPObjectType instances eagerly inside
// TypeRegistry::register_type(). The constructor resolves string interface names via
// TypeRegistry::get_type(). WPGraphQL Content Blocks registers Block at priority 100+,
// so at priority 10 (ACF block construction time), get_type('Block') → null → interfaces dropped.
//
// Fix: register Block/EditorBlock ourselves at priority 1. WPGraphQL TypeRegistry ignores
// duplicate registrations (no-op when name already registered), so Content Blocks' later
// registration is silently skipped and our stubs remain. When ACF block types are built at
// priority 10, TypeRegistry::get_type('Block') returns our stub → Block is preserved.
//
// resolveType: WPGraphQL Content Blocks sets __typename on each block array. graphql-php
// uses __typename directly before calling resolveType, so our resolveType is a fallback only.
// It also handles blockName → type name conversion for safety.
// ─────────────────────────────────────────────────────────────────────────────
add_action( 'graphql_register_types', function () {
    if ( ! function_exists( 'register_graphql_interface_type' ) ) {
        update_option( 'rq_diag_strategy_g', 'SKIP:function_not_found', false );
        return;
    }

    // resolveType: maps block data array → WPGraphQL concrete type object.
    $resolve_type = static function ( $block ) {
        try {
            $type_name = null;
            if ( is_array( $block ) ) {
                // WPGraphQL Content Blocks sets __typename or graphqlTypeName directly.
                $type_name = isset( $block['__typename'] )     ? $block['__typename']
                           : ( isset( $block['graphqlTypeName'] ) ? $block['graphqlTypeName'] : null );

                // Fallback: derive from blockName e.g. 'acf/racqueteer-hero' → 'AcfRacqueteerHeroBlock'
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

    // Fields that WPGraphQL Content Blocks declares on the Block interface.
    // Registering the exact same fields ensures schema compatibility.
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
            'description' => 'Block interface — pre-registered at priority 1 for ACF timing fix (v17)',
            'fields'      => $block_fields,
            'resolveType' => $resolve_type,
        ) );
        $g_log[] = 'Block:ok';
    } catch ( \Throwable $e ) {
        $g_log[] = 'Block:err:' . $e->getMessage();
    }

    try {
        register_graphql_interface_type( 'EditorBlock', array(
            'description' => 'EditorBlock interface — pre-registered at priority 1 for ACF timing fix (v17)',
            'fields'      => $block_fields,
            'resolveType' => $resolve_type,
        ) );
        $g_log[] = 'EditorBlock:ok';
    } catch ( \Throwable $e ) {
        $g_log[] = 'EditorBlock:err:' . $e->getMessage();
    }

    update_option( 'rq_diag_strategy_g', implode( '|', $g_log ), false );
}, 1 ); // ← MUST be priority 1, fires before ACF blocks at priority 10

// ── Strategy E: kept as belt-and-suspenders ───────────────────────────────── (originally v16 MAIN FIX)
//
// register_graphql_interfaces_to_types() called at graphql_register_types PRIORITY 1.
// With Strategy G now pre-registering Block at priority 1, this is a secondary safety net.
// It queues an internal callback at priority 10 that calls register_extra_interface() for each
// ACF block type name, in case the eager type construction path missed Block for any type.
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
}, 1 ); // ← priority 1 — CRITICAL for v16 fix

// ── v17 DIAGNOSTIC: TypeRegistry check at priority 99 ───────────────────────
add_action( 'graphql_register_types', function () {
    try {
        $reg = class_exists( '\WPGraphQL' ) ? \WPGraphQL::get_type_registry() : null;

        $lookup = function ( $reg, $name ) {
            if ( ! $reg ) { return 'no_reg'; }
            foreach ( array( 'get_type', 'get_registered_type' ) as $method ) {
                if ( method_exists( $reg, $method ) ) {
                    $t = $reg->{$method}( $name );
                    if ( $t ) { return 'found_via_' . $method . ':' . ( is_array( $t ) ? 'array_config' : get_class( $t ) ); }
                    // Also lowercase
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

        // Sample registered type names at priority 99 (for diagnosing key naming)
        if ( $reg && method_exists( $reg, 'get_type_map' ) ) {
            $map   = $reg->get_type_map();
            $names = array_slice( array_keys( $map ), 0, 40 );
            update_option( 'rq_diag_v16_typemap_p99', implode( '|', $names ), false );
        }

        // Check extra_type_interfaces to confirm Strategy E fired
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

// ── Strategy B: graphql_wp_object_type_config — fires at schema build ──────
// At this point, ALL graphql_register_types callbacks have completed.
// Block should now be in TypeRegistry (buildable via get_type).
add_filter( 'graphql_wp_object_type_config', function ( $config ) {
    if ( ! is_array( $config ) || ! isset( $config['name'] ) ) {
        return $config;
    }

    $name = $config['name'];

    // Track all Acf* type names for diagnostics
    if ( 0 === strncmp( $name, 'Acf', 3 ) ) {
        $seen = get_option( 'rq_diag_type_names', array() );
        if ( ! is_array( $seen ) ) { $seen = array(); }
        $seen[ $name ] = 1;
        update_option( 'rq_diag_type_names', $seen, false );
    }

    // Inject Block interface for AcfRacqueteer*Block types
    if ( 0 === strncmp( $name, 'Acf', 3 ) && 'Block' === substr( $name, -5 ) ) {
        $before = isset( $config['interfaces'] ) ? implode( ',', (array) $config['interfaces'] ) : 'NONE';

        try {
            // At graphql_wp_object_type_config time, try to get the actual type OBJECT
            // (not just a string) — all graphql_register_types callbacks are done.
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

            // Prefer real type objects; fall back to strings
            $required_ifaces = array( 'Block' => $block_type );
            // Add EditorBlock only when we resolved a real type object.
            if ( $editor_type && ! is_array( $editor_type ) ) {
                $required_ifaces['EditorBlock'] = $editor_type;
            }

            foreach ( $required_ifaces as $iface_name => $iface_obj ) {
                // Check if already present (by string or object name)
                $already = false;
                foreach ( $interfaces as $existing ) {
                    if ( is_string( $existing ) && $existing === $iface_name ) { $already = true; break; }
                    if ( is_object( $existing ) ) {
                        $n = isset( $existing->name ) ? $existing->name : ( isset( $existing->config['name'] ) ? $existing->config['name'] : '' );
                        if ( $n === $iface_name ) { $already = true; break; }
                    }
                }
                if ( ! $already ) {
                    // Use real object if available AND it's a proper type instance, else string
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

// ── Strategy C: Priority 100 FALLBACK registration ───────────────────────────
// Fires after WPGraphQL for ACF (~priority 10) — registers any missed block types.
// Interfaces are intentionally empty here; Strategy E (priority 1) injects them via
// TypeRegistry::extra_type_interfaces which is applied during type build.
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
            // Proceed with registration attempt
        }

        if ( $already_registered ) {
            continue;
        }

        try {
            register_graphql_object_type( $type_name, array(
                'description' => 'ACF Gutenberg block: ' . $type_name,
                // Ensure fallback types satisfy WPGraphQL Content Blocks contract.
                // Without these interfaces/fields, Page.blocks excludes the block type.
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
// Deploy sentinel + enums
// ═════════════════════════════════════════════════════════════════════════════
add_action( 'graphql_register_types', function () {
    if ( ! function_exists( 'register_graphql_enum_type' ) ) {
        return;
    }
    try {
        register_graphql_enum_type( 'LocationStatus', array(
            'description' => 'Status of a Racqueteer location',
            'values'      => array(
                'available'   => array( 'value' => 'available' ),
                'coming_soon' => array( 'value' => 'coming_soon' ),
            ),
        ) );
    } catch ( \Throwable $e ) {}
    try {
        register_graphql_enum_type( 'RqDeployVersion', array(
            'description' => 'Deployment version sentinel',
            'values'      => array( 'v19' => array( 'value' => 'v19' ) ),
        ) );
    } catch ( \Throwable $e ) {}
} );

// ═════════════════════════════════════════════════════════════════════════════
// Flat Rq*Fields types + flat ACF field on each block type
// Priority 5 — registered before block types are built
// ═════════════════════════════════════════════════════════════════════════════
add_action( 'graphql_register_types', function () {
    if ( ! function_exists( 'register_graphql_object_type' ) ) {
        return;
    }

    $all_fields = array(
        'RqRacqueteerHeroFields'                => array( 'title', 'description', 'ctaPrimaryText', 'ctaPrimaryUrl', 'ctaSecondaryText', 'ctaSecondaryUrl', 'videoUrl' ),
        'RqRacqueteerAboutFields'               => array( 'label', 'title', 'description', 'stat1Number', 'stat1Label', 'stat2Number', 'stat2Label', 'leftImage', 'rightImage' ),
        'RqRacqueteerLocationsFields'           => array( 'label', 'title', 'description' ),
        'RqRacqueteerProgramsFields'            => array( 'label', 'title', 'description', 'tabs' ),
        'RqRacqueteerMembershipCtaFields'       => array( 'label', 'title', 'description', 'ctaText', 'ctaUrl', 'bgImage' ),
        'RqRacqueteerSubscriptionsFields'       => array( 'label', 'title', 'description' ),
        'RqRacqueteerTestimonialsFields'        => array( 'label', 'title', 'description' ),
        'RqRacqueteerEventsFields'              => array( 'title', 'description', 'ctaText', 'ctaUrl', 'image' ),
        'RqRacqueteerMembershipHeroFields'      => array( 'label', 'title', 'description', 'priceStarting', 'priceUnit', 'ctaText', 'videoUrl' ),
        'RqRacqueteerSubscriptionsDetailFields' => array( 'label', 'title', 'description' ),
        'RqRacqueteerPriceCompareFields'        => array( 'label', 'title', 'description' ),
        'RqRacqueteerPrivateEventsHeroFields'   => array( 'label', 'title', 'description', 'ctaText', 'ctaUrl', 'videoUrl' ),
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
                'description' => 'Flat ACF fields for ' . $fields_type,
                'fields'      => $gql_fields,
            ) );
        } catch ( \Throwable $e ) {
            // Ignore duplicate registration
        }
    }

    // Register flat ACF field on each block type
    $block_field_map = array(
        'AcfRacqueteerHeroBlock'                => array( 'field' => 'racqueteerHero',                'type' => 'RqRacqueteerHeroFields' ),
        'AcfRacqueteerAboutBlock'               => array( 'field' => 'racqueteerAbout',               'type' => 'RqRacqueteerAboutFields' ),
        'AcfRacqueteerLocationsBlock'           => array( 'field' => 'racqueteerLocations',           'type' => 'RqRacqueteerLocationsFields' ),
        'AcfRacqueteerProgramsBlock'            => array( 'field' => 'racqueteerPrograms',            'type' => 'RqRacqueteerProgramsFields' ),
        'AcfRacqueteerMembershipCtaBlock'       => array( 'field' => 'racqueteerMembershipCta',       'type' => 'RqRacqueteerMembershipCtaFields' ),
        'AcfRacqueteerSubscriptionsBlock'       => array( 'field' => 'racqueteerSubscriptions',       'type' => 'RqRacqueteerSubscriptionsFields' ),
        'AcfRacqueteerTestimonialsBlock'        => array( 'field' => 'racqueteerTestimonials',        'type' => 'RqRacqueteerTestimonialsFields' ),
        'AcfRacqueteerEventsBlock'              => array( 'field' => 'racqueteerEvents',              'type' => 'RqRacqueteerEventsFields' ),
        'AcfRacqueteerMembershipHeroBlock'      => array( 'field' => 'racqueteerMembershipHero',      'type' => 'RqRacqueteerMembershipHeroFields' ),
        'AcfRacqueteerSubscriptionsDetailBlock' => array( 'field' => 'racqueteerSubscriptionsDetail', 'type' => 'RqRacqueteerSubscriptionsDetailFields' ),
        'AcfRacqueteerPriceCompareBlock'        => array( 'field' => 'racqueteerPriceCompare',        'type' => 'RqRacqueteerPriceCompareFields' ),
        'AcfRacqueteerPrivateEventsHeroBlock'   => array( 'field' => 'racqueteerPrivateEventsHero',   'type' => 'RqRacqueteerPrivateEventsHeroFields' ),
        'AcfRacqueteerGalleryBlock'             => array( 'field' => 'racqueteerGallery',             'type' => 'RqRacqueteerGalleryFields' ),
        'AcfRacqueteerLogoMarqueeBlock'         => array( 'field' => 'racqueteerLogoMarquee',         'type' => 'RqRacqueteerLogoMarqueeFields' ),
        'AcfRacqueteerAboutHeroBlock'           => array( 'field' => 'racqueteerAboutHero',           'type' => 'RqRacqueteerAboutHeroFields' ),
        'AcfRacqueteerMissionBlock'             => array( 'field' => 'racqueteerMission',             'type' => 'RqRacqueteerMissionFields' ),
        'AcfRacqueteerContactBlock'             => array( 'field' => 'racqueteerContact',             'type' => 'RqRacqueteerContactFields' ),
        'AcfRacqueteerCareersHeroBlock'         => array( 'field' => 'racqueteerCareersHero',         'type' => 'RqRacqueteerCareersHeroFields' ),
        'AcfRacqueteerJobListingsBlock'         => array( 'field' => 'racqueteerJobListings',         'type' => 'RqRacqueteerJobListingsFields' ),
        'AcfRacqueteerCareerContactBlock'       => array( 'field' => 'racqueteerCareerContact',       'type' => 'RqRacqueteerCareerContactFields' ),
    );

    // Image field key sets — used in the resolve closure below.
    // single_image: scalar attachment ID → URL string (return_format:'url')
    // gallery_url:  array of IDs → JSON array of URL strings (return_format:'url')
    // gallery_arr:  array of IDs → JSON array of {id,url,sourceUrl} objects (return_format:'array')
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
                            continue; // skip ACF internal meta keys like _left_image
                        }
                        // snake_case → camelCase
                        $words = explode( '_', $k );
                        $camel = strtolower( $words[0] );
                        for ( $i = 1, $n = count( $words ); $i < $n; $i++ ) {
                            $camel .= ucfirst( strtolower( $words[ $i ] ) );
                        }

                        // ── Single image: attachment ID → URL string ─────────────────────────
                        if ( in_array( $k, $rq_single_image_keys, true ) ) {
                            if ( is_numeric( $v ) && (int) $v > 0 ) {
                                $url = wp_get_attachment_url( (int) $v );
                                $out[ $camel ] = $url ?: (string) $v;
                            } else {
                                $out[ $camel ] = is_string( $v ) ? $v : '';
                            }
                            continue;
                        }

                        // ── Gallery (return_format:'url'): array of IDs → JSON array of URLs ─
                        if ( in_array( $k, $rq_gallery_url_keys, true ) && is_array( $v ) ) {
                            $urls = array();
                            foreach ( $v as $id ) {
                                if ( is_numeric( $id ) && (int) $id > 0 ) {
                                    $url = wp_get_attachment_url( (int) $id );
                                    if ( $url ) { $urls[] = $url; }
                                } elseif ( is_string( $id ) && '' !== $id ) {
                                    $urls[] = $id; // already a URL
                                }
                            }
                            $out[ $camel ] = json_encode( $urls, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
                            continue;
                        }

                        // ── Gallery (return_format:'array'): IDs → JSON array of objects ─────
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

                        // ── Default: JSON-encode arrays; pass scalars as-is ────────────────
                        $out[ $camel ] = is_array( $v ) ? json_encode( $v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) : $v;
                    }
                    return $out;
                },
            ) );
        } catch ( \Throwable $e ) {
            // Field already exists (WPGraphQL for ACF registered it) — ignore
        }
    }

}, 5 );

// ═════════════════════════════════════════════════════════════════════════════
// Navbar + Footer options — manual fallback (skipped for WPGraphQL for ACF v4+)
//
// Priority 5 (same as block fields) so we register BEFORE WPGraphQL for ACF
// (priority 10). If WPGraphQL for ACF tries to re-register acfOptionsNavbar /
// acfOptionsFooter afterwards it will silently fail — our resolver wins and
// correctly calls get_field() to resolve logo image attachment IDs to URLs.
// ═════════════════════════════════════════════════════════════════════════════
add_action( 'graphql_register_types', function () {
    if ( ! function_exists( 'register_graphql_field' )
         || ! function_exists( 'register_graphql_object_type' ) ) {
        return;
    }

    // Skip for WPGraphQL for ACF v4.x — it auto-registers these fields
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
            'description' => 'Navigation link item',
            'fields'      => array(
                'label' => array( 'type' => 'String' ),
                'url'   => array( 'type' => 'String' ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqImageRef' ) ) {
        register_graphql_object_type( 'RqImageRef', array(
            'description' => 'Image reference',
            'fields'      => array(
                'sourceUrl' => array( 'type' => 'String' ),
                'altText'   => array( 'type' => 'String' ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqFooterLocation' ) ) {
        register_graphql_object_type( 'RqFooterLocation', array(
            'description' => 'Footer location',
            'fields'      => array(
                'name'    => array( 'type' => 'String' ),
                'address' => array( 'type' => 'String' ),
            ),
        ) );
    }
    if ( ! $type_exists( 'RqNavbarFields' ) ) {
        register_graphql_object_type( 'RqNavbarFields', array(
            'description' => 'ACF Navbar options fields',
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
            'description' => 'Wrapper for acfOptionsNavbar',
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
            'description' => 'ACF Footer options fields',
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
            'description' => 'Wrapper for acfOptionsFooter',
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

}, 5 );

// ═════════════════════════════════════════════════════════════════════════════
// Strategy H — Runtime resolver override for Page.blocks (v18)
//
// Problem: WPGraphQL Content Blocks' Page.blocks resolver only returns blocks
// that are in its own internal registry (built from WP Block Registry AT THE
// TIME Content Blocks initialises). When Content Blocks processes the registry,
// the block type `acf/racqueteer-hero` IS in WP_Block_Type_Registry (registered
// by acf_register_block_type → register_block_type on acf/init), but Content
// Blocks may skip it because its own type `AcfRacqueteerHeroBlock` was already
// registered by WPGraphQL for ACF → duplicate → Content Blocks omits the
// `acf/racqueteer-hero` → AcfRacqueteerHeroBlock mapping from its lookup table
// → returning 0 blocks at runtime even though the schema is correct.
//
// Fix: hook into graphql_resolve_field AFTER the resolver runs. If `blocks`
// returned an empty array, we replace it with our own parse_blocks() result,
// mapping each `acf/*` block name to the correct GraphQL type name. The existing
// flat Rq*Fields resolvers (registered below at priority 5) read from
// $source['attrs']['data'] — exactly where ACF stores field values inside the
// Gutenberg block comment — so all ACF field data flows through automatically.
// ═════════════════════════════════════════════════════════════════════════════
add_filter( 'graphql_resolve_field', function ( $result, $source, $args, $context, $info, $type_name, $field_key, $type, $field ) {

    // Only intercept the `blocks` field (not editorBlocks or other fields)
    if ( 'blocks' !== $field_key ) {
        return $result;
    }

    // Only act on Page / Post / similar content types
    $content_types = array( 'Page', 'Post', 'NodeWithContentEditor' );
    if ( ! in_array( $type_name, $content_types, true ) ) {
        return $result;
    }

    // Only replace if result is empty (don't override a working resolver)
    if ( ! empty( $result ) ) {
        return $result;
    }

    // WP block name → GraphQL type name mapping
    static $block_type_map = null;
    if ( null === $block_type_map ) {
        $block_type_map = array(
            'acf/racqueteer-hero'                  => 'AcfRacqueteerHeroBlock',
            'acf/racqueteer-about'                 => 'AcfRacqueteerAboutBlock',
            'acf/racqueteer-locations'             => 'AcfRacqueteerLocationsBlock',
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
        // Resolve the raw WP_Post object from the WPGraphQL model
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
                continue; // skip non-ACF or whitespace blocks
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
                'attrs'       => $attrs,
                'data'        => isset( $attrs['data'] ) ? $attrs['data'] : array(),
                'innerBlocks' => isset( $raw['innerBlocks'] ) ? $raw['innerBlocks'] : array(),
            );
            $type_names[] = $type_name_block;
        }

        // Store diagnostic info (consumed by rq_verify_graphql diagnostics)
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

// ── passthrough no-op (kept for compat) ───────────────────────────────────
add_filter( 'graphql_connection_query_args', function ( $args ) {
    return $args;
} );
