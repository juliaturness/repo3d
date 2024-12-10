// imports statements
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// variável que carrega o modelo 3D com extensão definida
const modelPath = './dunot.glb';



// função que extrai a extensão do modelo 3D adicionado
function getFileExtension(filePath) {
  return filePath.split('.').pop().toLowerCase();
}

// cria um file path com o .mtl
function obj2mtl(filePath) {
  return filePath.substring(0, filePath.lastIndexOf('.')) + '.mtl';
}


// funcção que retorna se o modelo 3D oferecido é OBJ ou GLTF/GLB
function checkFileExtension(fileExtension) {
  switch (fileExtension) {
    case 'obj':
      return true;
    case 'glb':
    case 'gltf':
      return false;
    default:
      console.error('Extensão de arquivo não aceita.')
      console.warn('Por favor, insira um arquivo .obj ou .glb/.gltf.')
      return null;
  }
}

// define se o modelo 3D oferecido é OBJ ou GLTF/GLB
const objModel = checkFileExtension(getFileExtension(modelPath))



// cena e câmera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// define o renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*
TODO: melhorar a iluminação da cena:
objetos mais escuros ficam difíceis
de enxergar caso estejam contra a luz
*/
// define a luz
const light = new THREE.AmbientLight(0x404040, 2); 
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5); 
scene.add(directionalLight);

// carregador para o modelo 3D
// por padrão, carrega o loader como GLB/GLTF
let loader;
// carrega o modelo de acordo com seu tipo
if (objModel == true) {

  if (objModel == true) {
    // carrega arquivos OBJ
    loader = new MTLLoader();
    loader.load(obj2mtl(modelPath), function(materials) {
      materials.preload();
  
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);

      objLoader.load(modelPath, function (object) {
        scene.add(object);
      }, undefined, function (error) {
        console.error('Erro ao carregar arquivo OBJ:', error);
      });
    }, undefined, function(error) {
      console.error('Erro ao carregar arquivo MTL:', error);
    });

  }

} else if (objModel == false) {
  // carrega arquivos GLB/GLTF
  loader = new GLTFLoader();
  loader.load(modelPath, function(gltf) {
    scene.add(gltf.scene);
  }, undefined, function(error) {
    console.error('Erro ao carregar arquivo GLB/GLTF:', error);
  });
} else {
  // caso objModel == null é porque ocorreu um erro
  console.error('Arquivo inválido ou não suportado.');
}



// função para criar animação da cena
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// executa função de animar
animate();
// ajusta a posição da camera
camera.position.z = 5;

// garante a responsividade da tela caso seja redimensionada
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});



// ajusta definições de camera após uma mudança de posição da câmera
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
