export default function EmptyState(props) {
  return (
    <div className="text-center">
      <props.icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg text-white">{props.heading}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {props.description}
      </p>
    </div>
  );
}
