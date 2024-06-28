import LoadingSpinner from "@components/LoadingSpinner";

export default function ProcessView({ length, progress }) {
  return (
    <>
      <LoadingSpinner className={"w-10 h-10"} />
      <div className="">{`${progress}/${length}`}</div>
    </>
  );
}
