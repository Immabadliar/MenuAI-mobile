import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReduceTransparency() {
  const [isReduced, setIsReduced] = useState(false);
  useEffect(() => {
    let isMounted = true;
    void AccessibilityInfo.isReduceTransparencyEnabled().then((value) => {
      if (isMounted) setIsReduced(value);
    });
    const listener = AccessibilityInfo.addEventListener("reduceTransparencyChanged", setIsReduced);
    return () => {
      isMounted = false;
      listener.remove();
    };
  }, []);
  return isReduced;
}
