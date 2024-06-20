export default function Container(props) {
  return <div className={`px-5 py-3 ${props.className}`}>{props.children}</div>;
}
