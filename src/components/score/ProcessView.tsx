import LoadingSpinner from "@components/LoadingSpinner";

export default function ProcessView({ length, progress }) {
  return (
    <>
      <LoadingSpinner className={"w-24 h-24"} />
      <div className="">{`${progress}/${length}`}</div>
    </>
  );
}
