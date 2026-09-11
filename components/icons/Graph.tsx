export default function IconGraph({
  size = 24,
  color = "currentColor",
  stroke = 2,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icon-tabler-graph"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke-width={stroke}
      stroke={color}
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-label="Graph"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="10" r="2" />
      <circle cx="9" cy="18" r="2" />
      <circle cx="17" cy="19" r="2" />
      <path d="M7.7 7.2l8.6 2.1" />
      <path d="M6.8 7.9l1.6 8.3" />
      <path d="M10.8 17.2l4.4 1.1" />
      <path d="M17.3 11.9l-.3 5.2" />
    </svg>
  );
}
