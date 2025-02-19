export const DrawerContent = ({ title, children }) => {
  return (
    <div className="drawer-content ms-auto container">
      <h3 className="my-3 text-uppercase">{title}</h3>
      <hr />
      {children}
    </div>
  );
};
