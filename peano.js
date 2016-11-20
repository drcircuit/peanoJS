/**
 * Created by Espen on 11/19/2016.
 */
(function (order) {
    function setupScreen() {
        var canvas = document.createElement('canvas');
        canvas.id = 'space';
        var side = (window.innerHeight < window.innerWidth) ? window.innerHeight : window.innerWidth;
        canvas.width = side;
        canvas.height = side;
        document.body.appendChild(canvas);
        var getHeight = function () {
            return canvas.height;
        };
        var getWidth = function () {
            return canvas.width;
        };
        return {
            ctx: canvas.getContext('2d'),
            width: getWidth,
            height: getHeight
        }
    }

    var scr = setupScreen();
    var peano = lProgram();
    var result = "A";

    for (var i = 0; i < order; ++i) {
        result = peano.evolve(result);
    }

    plot(scr, result, order);

    function nextVector(vector, angle, min, order) {
        return {
            //Cartesians :
            //  x = cos(0) * mag,
            //  y = sin(0) * mag,
            // mag = plot width / (order+1)^2.3 <-- this is should actually be order+1 squared, but looks nicer in 2.3
            x: vector.x + Math.round(Math.cos(angle) * min / (Math.pow(order + 1, 2.3))),
            y: vector.y - Math.round(Math.sin(angle) * min / (Math.pow(order + 1, 2.3)))
        }
    }

    function lProgram() {

        // Identifiers : A, B  Instructions : D + −
        // Production rules:
        // A → − B D + A D A + D B −
        // B → + A D − B D B − D A +

        // Instructions:
        //       "D" "draw line",
        //       "−" "turn left 90°",
        //       "+" "turn right 90°"

        var rules = {
            A: "-BD+ADA+DB-",
            B: "+AD-BDB-DA+"
        };

        return {
            evolve: function (code) {
                var re = new RegExp(Object.keys(rules).join("|"), "gi");

                return code.replace(re, function (matched) {
                    return rules[matched];
                });
            }
        }
    }

    function plot(scr, program, order) {
        var vector = {}, angle = 0;

        var ctx = scr.ctx;

        vector.x = Math.round(scr.width() / (order + 1));
        vector.y = Math.round(scr.height() - scr.height() / (order + 1));
        var offset = nextVector(vector, angle, scr.width(), order);
        vector.x -= (offset.x - vector.x) / order / 2;
        vector.y += (offset.x - vector.x) / order / 2;
        for (var index = 0; index < program.length; ++index) {
            if (result[index] === "D") {
                ctx.strokeStyle = "#0FE";
                ctx.beginPath();
                ctx.moveTo(vector.x, vector.y);
                vector = nextVector(vector, angle, scr.width(), order);
                ctx.lineTo(vector.x, vector.y);
                ctx.stroke();
            } else if (program[index] === "+") {
                angle -= Math.PI / 2;
            } else if (program[index] === "-") {
                angle += Math.PI / 2;
            }
        }
    }
}(6));