// import * as THREE from "../build/three.module.js";
// import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

import * as THREE from "three";
import { OrbitControls } from "examples/jsm/controls/OrbitControls";

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
		// 마우스 컨트롤 정의
		this._setupControls();

		// 창 크기가 변할때마다 적용
		window.onresize = this.resize.bind(this);
		this.resize();

		// 적당한 시점에 render을 호출하게끔 함
		requestAnimationFrame(this.render.bind(this));
	}

	/**
	 * 마우스 컨트롤 정의
	 */
	_setupControls() {
		new OrbitControls(this._camera, this._divContainer);
	}

	_setupCamera() {
		// 3d를 출력할 캔바스 크기 얻기
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 2; // 카메라의 위치 지정
		this._camera = camera;
	}

	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4); // 광원 위치 지정
		this._scene.add(light); // scene의 구성 요소로 추가
	}

	/**
	 * BoxGeometry
	 */
	_setupModel() {
		const geometry = new THREE.BoxGeometry(1, 1, 1); //세그먼트 수를 지정하지 않으면 기본이 1,1,1임
		// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2); // 세그먼트수를 2,2,2로 지정

		// 메쉬 오브젝트 생성
		const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
		const cube = new THREE.Mesh(geometry, fillMaterial);

		// 라인 오브젝트 생성
		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
		const line = new THREE.LineSegments(
			// WireframeGeometry는 모든 외곽선을 표시함
			new THREE.WireframeGeometry(geometry),
			// 모든 외곽선이 표시되지 않음
			// geometry,
			lineMaterial
		);

		// 메쉬 오브젝트와 라인 오브젝트를 그룹으로 묶음
		const group = new THREE.Group();
		group.add(cube);
		group.add(line);

		this._scene.add(group);
		this._cube = group;
	}

	// _setupModel() {
	// 	const shape = new THREE.Shape();
	// 	// 화면 중앙이 0,0이고
	// 	shape.moveTo(1, 1); // 지점1
	// 	shape.lineTo(1, -1); // 지점2: 지점1~지점2 선긋기
	// 	shape.lineTo(-1, -1); // 지점3
	// 	shape.lineTo(-1, 1); // 지점4
	// 	shape.closePath(); // 지점1과 폐합

	// 	const geometry = new THREE.BufferGeometry();
	// 	const points = shape.getPoints();
	// 	geometry.setFromPoints(points);

	// 	const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
	// 	const line = new THREE.Line(geometry, material);

	// 	this._scene.add(line);
	// }

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize(width, height);
	}

	render(time) {
		this._renderer.render(this._scene, this._camera);
		// this.update(time); // 지동 회전 처리
		requestAnimationFrame(this.render.bind(this));
	}

	/**
	 * 자동 회전 처리
	 * @param {Number} time
	 */
	update(time) {
		time *= 0.001; // second unit
		this._cube.rotation.x = time;
		this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
