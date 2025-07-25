function Spinner() {
   return (
      <div
         className="inline-block h-3 w-3 animate-spin rounded-full border-[1.5px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
         role="status"
      >
         <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]"></span>
      </div>
   );
}

export default Spinner;
