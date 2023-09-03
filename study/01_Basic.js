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
		camera.position.z = 2;
		this._camera = camera;
	}

	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4); // 광원 위치 지정
		this._scene.add(light); // scene의 구성 요소로 추가
	}

	_setupModel() {
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });
		const cube = new THREE.Mesh(geometry, material);
		this._scene.add(cube);
		this._cube = cube;
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
		this._cube.rotation.x = time;
		this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
