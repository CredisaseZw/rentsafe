import { Fragment, useCallback, useState } from 'react';
import Drawer from 'react-bottom-drawer';

export default function BottomDrawer({
  trigger,
  children,
  isVisible,
  setIsVisible,
}) {
  const openDrawer = useCallback(() => {
    const body = document.querySelector('body');
    body.classList.add('drawer-toggled');
    setIsVisible(true);
  }, []);
  const closeDrawer = useCallback(() => {
    const body = document.querySelector('body');
    body.classList.remove('drawer-toggled');
    setIsVisible(false);
  }, []);

  return (
    <Fragment>
      <span style={{ cursor: 'pointer' }} onClick={openDrawer}>
        {trigger}
      </span>
      <Drawer
        duration={250}
        hideScrollbars={true}
        onClose={closeDrawer}
        isVisible={isVisible}
        unmountOnExit={true}
      >
        {!isVisible && (
          <i
            className="material-icons position-absolute top-0"
            onClick={closeDrawer}
            style={{ cursor: 'pointer', right: '50%', fontSize: '50px' }}
          >
            keyboard_arrow_down
          </i>
        )}
        {children}
      </Drawer>
    </Fragment>
  );
}
