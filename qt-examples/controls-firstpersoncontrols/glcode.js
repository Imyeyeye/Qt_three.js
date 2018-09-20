Qt.include("three.js")
Qt.include("FirstPersonControls.js")

var camera, scene, renderer;
var controls = new Object;
var clock = new THREE.Clock();
var materialPoint=new THREE.PointsMaterial({
                                               color:0xff0000,
                                               size:100.0//点对象像素尺寸
                                           });//材质对象
var points;

function initializeGL(canvas, eventSource) {

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcce0ff);
    scene.fog = new THREE.Fog(0xcce0ff, 50000, 300000); //增加雾化效果

    // camera
    camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 500, 150000);
    camera.position.z = -1;
    camera.position.y = 10000;
    scene.add( camera );

    //FirstPersonControl
    controls = new THREE.FirstPersonControls(camera, eventSource);
    controls.movementSpeed = 1000;
    controls.lookSpeed = 0.2;
    controls.lookVertical = true;

    // lights
    var ambientLight = new THREE.AmbientLight( 0x5F9EA0 );
    scene.add( ambientLight );

    var light, materials;

    light = new THREE.DirectionalLight(0xdfebff, 1);
    light.position.set(50, 200000, 100);
    light.position.multiplyScalar(1.3);

    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    var d = 3000;

    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;

    light.shadow.camera.far = 150000;

    scene.add(light);

    // ground
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load('qrc:/textures/terrain/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;

    var groundMaterial = new THREE.MeshLambertMaterial({
                                                           map: groundTexture
                                                       });

    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(400000, 400000), groundMaterial);
    mesh.position.y = -2000;
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    //Trajectory
    var geometry = new THREE.Geometry();//声明一个空几何体对象
    for(var i = 0;i<10000;i++)//根据传过来的数据点进行调整
    {
        var p = new THREE.Vector3(0,0,i);//顶点坐标
        geometry.vertices.push(p); //顶点坐标添加到geometry对象

    }
    points = new THREE.Points(geometry,materialPoint);//点模型对象
    scene.add(points);

    // renderer
    renderer = new THREE.Canvas3DRenderer(
                { canvas: canvas, antialias: true, devicePixelRatio: canvas.devicePixelRatio });
    renderer.setSize( canvas.width, canvas.height );
    renderer.setClearColor( scene.fog.color );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMap.enabled = true;
}

function resizeGL(canvas) {
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(canvas.devicePixelRatio);
    renderer.setSize( canvas.width, canvas.height );

    controls.handleResize();
}

function paintGL(canvas) {
    controls.update(clock.getDelta());
    renderer.render( scene, camera );
}

//轨迹显示/隐藏
function trackShow(){
    if(points.visible)
    {
        points.visible = false
    }
    else
    {
        points.visible = true
    }

}
