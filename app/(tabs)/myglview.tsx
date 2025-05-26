import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import React, { useRef } from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import * as THREE from "three";

export default function MyGLViewPage() {
  // Use ref to persist spinning state across renders and handlers
  const spinningRef = useRef(true);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const fakeCanvas = {
      addEventListener: () => {},
      removeEventListener: () => {},
      getContext: () => gl,
    };
    const renderer = new THREE.WebGLRenderer({
      context: gl,
      canvas: fakeCanvas as any,
      antialias: true,
    });
    renderer.setSize(width, height, false);
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    const render = () => {
      requestAnimationFrame(render);
      if (spinningRef.current) {
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
      }
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginVertical: 20,
      }}
    >
      <Text variant="displayMedium" style={{ marginVertical: 20 }}>
        This is a GLView
      </Text>

      <Pressable
        style={{ justifyContent: "center", alignItems: "center", backgroundColor: "red" }}
        onPress={() => {
          spinningRef.current = !spinningRef.current;
        }}
      >
        <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
      </Pressable>
    </View>
  );
}
