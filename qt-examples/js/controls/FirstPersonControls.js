/**
 * @author Imyeyeye / https://github.com/Imyeyeye/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, controlEventSource ) {

    this._object = object;
    this._controlEventSource = controlEventSource;
    var _this = this;
    this.target = new THREE.Vector3( 0, 0, 0 );

    this.enabled = true;

    this.movementSpeed = 1.0;
    this.lookSpeed = 0.005;

    this.lookVertical = true;
    this.autoForward = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.mouseDragOn = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    this.handleResize = function () {

        this.viewHalfX = this._controlEventSource.width / 2;
        this.viewHalfY = this._controlEventSource.height / 2;

    };

    function onMouseDown(buttons) {

        if ( _this.enabled === false ) return;
        if ( _this.activeLook ) {
        switch(buttons){
        case 1:_this.moveForward = true; break;
        case 2:_this.moveBackward = true; break;

        }
        }
        _this.mouseDragOn = true;

    };


    function onMouseMove( clientX, clientY ) {

        _this.mouseX = clientX - _this.viewHalfX;
        _this.mouseY = clientY - _this.viewHalfY;

    };





    this.update = function( delta ) {

        if ( this.enabled === false ) return;

        if ( this.heightSpeed ) {

            var y = THREE.Math.clamp( this._object.position.y, this.heightMin, this.heightMax );
            var heightDelta = y - this.heightMin;

            this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

        } else {

            this.autoSpeedFactor = 0.0;

        }

        var actualMoveSpeed = delta * this.movementSpeed * 10;
        //var actualMoveSpeed = 1000;

        if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this._object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
        if ( this.moveBackward ) this._object.translateZ( actualMoveSpeed );

        if ( this.moveLeft ) this._object.translateX( - actualMoveSpeed );
        if ( this.moveRight ) this._object.translateX( actualMoveSpeed );

        if ( this.moveUp ) this._object.translateY( actualMoveSpeed );
        if ( this.moveDown ) this._object.translateY( - actualMoveSpeed );

        var actualLookSpeed = delta * this.lookSpeed;

        if ( ! this.activeLook ) {

            actualLookSpeed = 0;

        }

        var verticalLookRatio = 1;

        if ( this.constrainVertical ) {

            verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

        }

        this.lon += this.mouseX * actualLookSpeed;
        if ( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

        this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
        this.phi = THREE.Math.degToRad( 90 - this.lat );

        this.theta = THREE.Math.degToRad( this.lon );

        if ( this.constrainVertical ) {

            this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

        }

        var targetPosition = this.target,
            position = this._object.position;

        targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
        targetPosition.y = position.y + 100 * Math.cos( this.phi );
        targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

        this._object.lookAt( targetPosition );

        this.moveForward = false;
        this.moveBackward = false;
        this.mouseDragOn = false;
    };


    this.dispose = function() {

        this._controlEventSource.removeEventListener( 'mousedown', onMouseDown, false );
        this._controlEventSource.removeEventListener( 'mousemove', onMouseMove, false );

    };


    this._controlEventSource.addEventListener( 'mousemove', onMouseMove, false );
    this._controlEventSource.addEventListener( 'mousedown', onMouseDown, false );

    this.handleResize();


};

THREE.FirstPersonControls.prototype = Object.create( THREE.EventDispatcher.prototype );
