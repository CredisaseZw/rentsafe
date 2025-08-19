interface Props {
  colorScheme?: "green" | "blue" | "danger";
  onClick?: () => void;
  isActive?: boolean;
}

const COLORS: Record<NonNullable<Props["colorScheme"]>, string> = {
  green: "#22c55e",
  blue: "#3b82f6",   
  danger: "#ef4444",
};

function CircledCheck({ onClick, isActive, colorScheme = "green" }: Props) {
  const color = COLORS[colorScheme];

  return (
    <div
      onClick={onClick}
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "9999px",
        border: `2px solid ${color}`,
        backgroundColor: isActive ? color : "transparent",
        cursor: "pointer",
      }}
    />
  );
}

export default CircledCheck;
