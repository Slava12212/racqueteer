
export default function AnimatedBlobs({ colors = ["#9AAFD0", "#7A9FBF", "#B8CCE0", "#6B8DB5"] }: { colors?: string[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {colors.map((color, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            background: color,
            width: `${35 + i * 8}vw`,
            height: `${35 + i * 8}vw`,
            filter: 'blur(100px)',
            opacity: 0.4,
            animation: `blob-move-${i} ${18 + i * 4}s ease-in-out infinite alternate`,
            left: `${10 + i * 20}%`,
            top: `${10 + i * 15}%`,
          }}
        />
      ))}
    </div>
  );
}
