(function() {
  'use strict';

  var renderer = getRenderer(),
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10000),
    scene = new THREE.Scene(),
    prevX,
    oGeometry,
    mesh,
    timeline;

  var ROTATION_RATE = 300,
    DEFORMATION_STRENGTH = 20;

  function init() {
    var L1,
      L2;

    document.getElementById('interactive-object').appendChild(renderer.domElement);

    camera.position.z = 200;
    scene.add(camera);
    renderer.setSize(200, 200);

    L1 = new THREE.PointLight(0xffffff, 1);
    L1.position.set(100, 100, 100);
    scene.add(L1);

    L2 = new THREE.PointLight(0xffffff, 0.8);
    L2.position.set(-100, 50, 200);
    scene.add(L2);

    mesh = createMesh();
    mesh.dynamic = true;
    mesh.rotation.z = 1;

    oGeometry = mesh.geometry.clone();

    scene.add(mesh);

    document.addEventListener('mousemove', mutate, false);

    TweenLite.ticker.addEventListener("tick", render);
    setupTweens();
  }

  function render() {
    renderer.render(scene, camera);
    mesh.geometry.verticesNeedUpdate = true;
  }

  function mutate(e) {
    if (!prevX) {
      prevX = e.clientX;
      return;
    }

    mesh.rotation.y -= (prevX - e.clientX) / ROTATION_RATE;
    timeline.progress(e.clientY / window.innerHeight);

    prevX = e.clientX;
  }

  function hasWebGL() {
    return (function() {
      try {
        var canvas = document.createElement('canvas');
        return !!window.WebGLRenderingContext &&
          (canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    })();
  }

  function getRenderer() {
    return hasWebGL() ?
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      }) :
      new THREE.CanvasRenderer({
        antialias: true,
        alpha: true
      });
  }

  function createMesh() {
    return new THREE.Mesh(
      new THREE.IcosahedronGeometry(75, 1),
      new THREE.MeshPhongMaterial({
        color: new THREE.Color(0x3ce8a9),
        emissive: new THREE.Color(0x1414cb),
        specular: new THREE.Color(0xff9bff),
        shininess: 10,
        shading: THREE.FlatShading,
        transparent: 1,
        opacity: 1,
        overdraw: true
      })
    );
  }

  function setupTweens() {
    var tweens = [];

    timeline = new TimelineLite();

    for (var i = 0; i < mesh.geometry.vertices.length; i++) {
      tweens.push(new TweenLite.to(mesh.geometry.vertices[i], 1, {
        x: oGeometry.vertices[i].x + (Math.random(0, 1) * 2 - 1) * DEFORMATION_STRENGTH,
        y: oGeometry.vertices[i].y + (Math.random(0, 1) * 2 - 1) * DEFORMATION_STRENGTH,
        z: oGeometry.vertices[i].z + (Math.random(0, 1) * 2 - 1) * DEFORMATION_STRENGTH
      }));
    }

    timeline.insertMultiple(tweens)
    timeline.pause();
  }

  init();
  render();

})();
