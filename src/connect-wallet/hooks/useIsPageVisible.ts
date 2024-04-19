// for more robust work consider switching to
// https://github.com/pgilad/react-page-visibility

import { useEffect, useState } from 'react';

export function useIsPageVisible() {
    const [isVisible, setIsVisible] = useState(false);

    const onVisibilityChange = () => {
        setIsVisible(document.visibilityState === 'visible');
    };

    useEffect(() => {
        onVisibilityChange();
        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, []);

    return isVisible;
}
