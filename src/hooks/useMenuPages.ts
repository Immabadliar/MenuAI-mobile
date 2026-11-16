import { useRef, useState } from "react";
import { Linking } from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import type { MenuPage } from "@/types";

import { errorMessage } from "./useResource";

export function useMenuPages() {
  const camera = useRef<CameraView>(null);
  const operation = useRef(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const [pages, setPages] = useState<MenuPage[]>([]);
  const [busy, setBusy] = useState<"capture" | "import" | "scan" | null>(null);
  const [error, setError] = useState("");
  const [captureCount, setCaptureCount] = useState(0);

  async function handleCapture() {
    if (operation.current || !isReady || !camera.current || pages.length >= 3) return;
    operation.current = true;
    setBusy("capture");
    setError("");
    try {
      const picture = await camera.current.takePictureAsync({ quality: 0.85 });
      setPages((current) =>
        [...current, { uri: picture.uri, width: picture.width, height: picture.height }].slice(
          0,
          3,
        ),
      );
      setCaptureCount((current) => current + 1);
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      operation.current = false;
      setBusy(null);
    }
  }

  async function handleImport() {
    if (operation.current || pages.length >= 3) return;
    operation.current = true;
    setBusy("import");
    setError("");
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: 3 - pages.length,
        quality: 1,
      });
      if (!response.canceled) {
        setPages((current) =>
          [
            ...current,
            ...response.assets.map((asset) => ({
              uri: asset.uri,
              width: asset.width,
              height: asset.height,
            })),
          ].slice(0, 3),
        );
      }
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      operation.current = false;
      setBusy(null);
    }
  }

  async function handlePermission() {
    try {
      if (permission?.canAskAgain) await requestPermission();
      else await Linking.openSettings();
    } catch {
      setError("Open Settings and allow camera access for MenuAI.");
    }
  }

  function beginOperation() {
    if (operation.current) return false;
    operation.current = true;
    return true;
  }

  function finishOperation() {
    operation.current = false;
    setBusy(null);
  }

  return {
    camera,
    beginOperation,
    finishOperation,
    permission,
    isReady,
    setIsReady,
    pages,
    setPages,
    busy,
    setBusy,
    error,
    setError,
    captureCount,
    handleCapture,
    handleImport,
    handlePermission,
  };
}
