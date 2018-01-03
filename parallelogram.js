/*
 * a js plugin to draw parallelogram and circle from three points
 * Author: Omar Mahrous
 * website: http://wpmeal.com
 * email: massive.v.b@gmail.com
 * 1-may-2016
 * all rights reserved 
 */
(function () {
    // set initial values of our points
    var first = {x: null, y: null},
    second = {x: null, y: 0},
    third = {x: null, y: null},
    fourth = {x: null, y: null},
    center = {x: null, y: null},
    // initial canvas
    c = document.getElementById("mycanvas"),
            ctx = c.getContext("2d"),
            width = c.width = window.innerWidth,
            height = c.height = window.innerHeight -300,
            area = 0,
            pointsNum = 0,
            // draw circle around point
            drawpoint = function (x, y) {
                ctx.clearRect(0, 0, 11, 11);
                ctx.beginPath();
                ctx.strokeStyle = 'red';
                ctx.arc(x, y, 5.5, 0, Math.PI * 2, false);
                ctx.stroke();
            },
            // draw line between two points
            drawLine = function (pointone, pointwo) {
                ctx.beginPath();
                ctx.strokeStyle = 'blue';
                ctx.moveTo(pointone.x, pointone.y);
                ctx.lineTo(pointwo.x, pointwo.y);
                ctx.stroke();
            },
            // calculate fourth point coords
            fourthCoordsCal = function () {
                var restxfs = second.x - first.x;
                fourth.x = third.x - restxfs;
                var restyfs = second.y - first.y;
                fourth.y = third.y - restyfs;
            },
            // draw parallelogram
            drawParrall = function () {
                drawLine(first, second);
                drawLine(second, third);
                drawLine(third, fourth);
                drawLine(fourth, first);

            },
            // calclulate center of parallelogram
            parrallCenterCal = function () {
                center.x = (first.x + second.x + third.x + fourth.x) / 4;
                center.y = (first.y + second.y + third.y + fourth.y) / 4;
            },
            // calculate area of parallelogram
            parrallAreaCal = function () {
                area = Math.abs(((first.x * second.y - first.y * second.x) + (second.x * third.y - second.y * third.x) + (third.x * fourth.y - third.y * fourth.x) + (fourth.x * first.y - fourth.y * first.x)) / 2);
            },
            // draw circle with same area and center of parallelogram
            drawCircle = function () {
                var r = Math.sqrt(area / Math.PI);
                ctx.beginPath();
                ctx.strokeStyle = 'yellow';
                ctx.arc(center.x, center.y, r, 0, 2 * Math.PI);
                ctx.stroke();
            },
            // calculate length of a line between two points
            plength = function (P1x, P2x, P1y, P2y) {
                return Math.sqrt((P1x - P2x) * (P1x - P2x) + (P1y - P2y) * (P1y - P2y));
            },
            // set points coords onclick and draw shapes on third click  
            drawShapesOnClick = function () {
                c.addEventListener("click", function (e) {
                    pointsNum++;
                    if (pointsNum <= 3) {
                        switch (pointsNum) {
                            case 1:
                                first.x = e.pageX;
                                first.y = e.pageY;
                                break;
                            case 2:
                                second.x = e.pageX;
                                second.y = e.pageY;
                                break;
                            case 3:
                                third.x = e.pageX;
                                third.y = e.pageY;
                                TriggerfourthCoordsCal();
                                TriggerDrawParrall();
                                parrallCenterCal();
                                parrallAreaCal();
                                drawCircle();
                                printedInfo();
                                break;
                        }


                        drawpoint(e.pageX, e.pageY);
                    }
                });
            }(),
            // tigger fourth point coords calculator
            TriggerfourthCoordsCal = function () {
                if (first.x != null && second.x != null && third.x != null) {
                    fourthCoordsCal();
                }
            },
            // tigger parallelogram draw
            TriggerDrawParrall = function () {
                if (first.x != null && second.x != null && third.x != null && fourth.x != null) {
                    drawParrall();
                }
            },
            // get min value with its key of an array
            arrayMin = function (arr) {
                var len = arr.length, min = Infinity;
                while (len--) {
                    if (arr[len] < min) {
                        min = arr[len];
                        var minkey = len;
                    }
                }
                return [minkey, min];
            },
            // a callback that move point and redraw a new shape when mousemove event exists 
            MovePoint = function (e) {
                if (checkPointsExist()) {
                    var len = [];
                    len[1] = plength(e.pageX, first.x, e.pageY, first.y);
                    len[2] = plength(e.pageX, second.x, e.pageY, second.y);
                    len[3] = plength(e.pageX, third.x, e.pageY, third.y);
                    len[4] = plength(e.pageX, fourth.x, e.pageY, fourth.y);
                    var minlengthArray = arrayMin(len);
                    if (minlengthArray[1] < 13) {
                        if (minlengthArray[0] == 1) {
                            first.x = e.clientX;
                            first.y = e.clientY;
                        } else if (minlengthArray[0] == 2) {
                            second.x = e.clientX;
                            second.y = e.clientY;
                        } else if (minlengthArray[0] == 3) {
                            third.x = e.clientX;
                            third.y = e.clientY;
                        }
                        ctx.clearRect(0, 0, width, height);
                        drawpoint(first.x, first.y);
                        drawpoint(second.x, second.y);
                        drawpoint(third.x, third.y);
                        TriggerDrawParrall();
                        parrallCenterCal();
                        parrallAreaCal();
                        drawCircle();
                        printedInfo();
                    }
                }
            },
            // remove event listerner to mouseup and mousemove 
            onMouseUp = function (event) {
                document.body.removeEventListener("mousemove", MovePoint);
                document.body.removeEventListener("mouseup", onMouseUp);
            },
            // trigger moving of a point on mousedown and move, stopped it when mouseup
            TriggerMovePoint = function () {
                document.body.addEventListener("mousedown", function (event) {
                    document.body.addEventListener("mousemove", MovePoint);
                    document.body.addEventListener("mouseup", onMouseUp);
                })
            }(),
            // check if four points coords exist
            checkPointsExist = function () {
                if (first.x != null && second.x != null && third.x != null && fourth.x != null) {
                    return true
                }
                return false;
            },
            // output info about points coords and area to browser
            printedInfo = function () {
                var info = 'Shape Info:<li>x1&nbsp:' + first.x + '&nbspy1&nbsp:' + first.y + '</li><li>x2&nbsp:' + second.x + '&nbspy2&nbsp:' + second.y + '</li><li>x3&nbsp:' + third.x + '&nbspy3&nbsp:' + third.y + '</li><li>Parallelogram Area&nbsp:' + area + '&nbsp;Circle Area&nbsp:' + area + '</li>';
                document.getElementById('printedinfo').innerHTML = info;
                document.getElementById('reset').style.display = 'block';

            },
            // clear drawning area
            resetDrawBoard = function () {
                document.getElementById('reset').addEventListener("click", function (event) {
                    ctx.clearRect(0, 0, width, height);
                    pointsNum = 0;
                });
            }()
       

})();


  