// import * as THREE from "../build/three.module.js";
import * as THREE from "three";

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer; // _는 private임

		// renderer 정의
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio); // OS 해상도 배율 지정
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		// scene 정의
		const scene = new THREE.Scene();
		this._scene = scene;

		// camera 정의
		this._setupCamera();
		// light 정의
		this._setupLight();
		// mesh 정의
		this._setupModel();

		// 창 크기가 변할때마다 적용
		window.onresize = this.resize.bind(this);
		this.resize();

		// 적당한 시점에 render을 호출하게끔 함
		requestAnimationFrame(this.render.bind(this));
	}

	_setupCamera() {
		// 3d를 출력할 캔바스 크기 얻기
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 15;
		this._camera = camera;
	}

	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(1, 20, 40); // 광원 위치 지정
		this._scene.add(light); // scene의 구성 요소로 추가
	}

	_setupModel() {
		// 태양을 위한 3차원 객체를 생성하고 태양을 그려넣는 공간으로 사용
		const solarSystem = new THREE.Object3D();
		this._scene.add(solarSystem);

		// 구 모양의 지오메트리 생성
		const radius = 1;
		const widthSegments = 12;
		const heightSegments = 12;
		const sphereGeometry = new THREE.SphereGeometry(
			radius,
			widthSegments,
			heightSegments
		);

		// 태양의 재질 생성
		const sunMaterial = new THREE.MeshPhongMaterial({
			emissive: 0xffff00,
			flatShading: true,
		});

		// 구 모양의 지오메트리와 태양 재질을 이용해서 sunMesh 객체 생성
		const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
		sunMesh.scale.set(3, 3, 3);
		solarSystem.add(sunMesh);

		// 지구를 위한 3차원 객체를 생성하고 지구를 그려넣는 공간으로 사용
		const earthOrbit = new THREE.Object3D();
		earthOrbit.position.x = 10; //10만큼 떨어진 위치에 추가
		solarSystem.add(earthOrbit); // solarSystem의 자식으로 추가

		// 지구의 재질 추가
		const earthMaterial = new THREE.MeshPhongMaterial({
			color: 0x2233ff,
			emissive: 0x112244,
			flatShading: true,
		});

		// 구 모양의 지오메트리와 지구 재질을 이용해서 earthMesh 객체 생성
		const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
		earthOrbit.add(earthMesh);

		// 마찬가지로
		// 달을 위한 3차원 객체를 생성하고 달을 그려넣는 공간으로 사용
		const moonOrbit = new THREE.Object3D();
		moonOrbit.position.x = 2;
		earthOrbit.add(moonOrbit);

		// 달의 재질 추가
		const moonMaterial = new THREE.MeshPhongMaterial({
			color: 0x888888,
			emissive: 0x222222,
			flatShading: true,
		});

		// 구 모양의 지오메트리와 달의 재질을 이용해서 moonMesh 객체 생성
		const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
		moonMesh.scale.set(0.5, 0.5, 0.5);
		moonOrbit.add(moonMesh);

		this._solarSystem = solarSystem;
		this._earthOrbit = earthOrbit;
		this._moonOrbit = moonOrbit;
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize(width, height);
	}

	render(time) {
		this._renderer.render(this._scene, this._camera);
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001; // second unit
		this._solarSystem.rotation.y = time / 2; // 태양을 자전시킴
		this._earthOrbit.rotation.y = time * 2; // 지구를 자전시킴
		// this._moonOrbit.rotation.y = time * 5; // 달을 자전시킴
	}
}

window.onload = function () {
	new App();
};
