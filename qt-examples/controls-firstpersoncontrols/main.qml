import QtQuick 2.4
import QtCanvas3D 1.1
import QtQuick.Window 2.2
import QtQuick.Controls 2.3

import "glcode.js" as GLCode

Window {
    title: qsTr("controls-firstpersoncontrols")
    width: 640
    height: 360
    visible: true

    Row{
        anchors.fill: parent
        Column {
            anchors.verticalCenter: parent.verticalCenter
            width: 100
            Button{
                text:qsTr("轨迹隐藏/显示")
                onClicked:GLCode.trackShow()
            }
        }

        Canvas3D {
            id: canvas3d
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            width: parent.width - 100

            focus: true

            onInitializeGL: {
                GLCode.initializeGL(canvas3d, eventSource);
            }

            onPaintGL: {
                GLCode.paintGL(canvas3d);
            }

            onResizeGL: {
                GLCode.resizeGL(canvas3d);
            }

            ControlEventSource {
                id: eventSource
                anchors.fill: parent
                focus: true
            }
        }

    }

}
