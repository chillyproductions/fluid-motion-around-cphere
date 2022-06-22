const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 100;
const height = 50;
const size = 10;

canvas.height = height * size;
canvas.width = width * size;

ctx.translate(width*size/2,height*size/2);
ctx.scale(1,-1);

const U = 20;
const R = 10;
var particles=[];

var showVector = true;

function loop(){
    var timer = getTime();
    counter = 0;

    setInterval(()=>{
        ctx.clearRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
        let dt = (getTime() - timer)/1000;
        for(let i in particles){
            let particle = particles[i]
            if(particle.x < -width){
                particles.splice(i,1);
                continue;
            }
            let r = Math.sqrt(particle.x**2 + particle.y**2);
            let theta = Math.atan(particle.y / Math.abs(particle.x))
            let ur = -U * Math.cos(theta) * (1 - (3 * R) / (2*r) + (R**3) / (2* r**3))
            let u0 = U * Math.sin(theta) * (1 - (3 * R) / (4*r) + (R**3) / (4* r**3))
            let u = Math.sqrt(ur * ur + u0 * u0)
            let a = Math.PI - Math.atan(u0 / ur) - theta
            
            
            ctx.strokeStyle = 'blue';
            ctx.fillStyle = 'blue';

            if (particle.x>0){
                particle.x += u * Math.cos(a) *dt;
                particle.y += -u * Math.sin(a) *dt;
                if(showVector)
                    canvas_arrow(particle.x ,particle.y,u * Math.cos(a),-u * Math.sin(a));

            }
            else{
                particle.x += u * Math.cos(a) *dt;
                particle.y += u * Math.sin(a) *dt;
                if(showVector)
                    canvas_arrow(particle.x ,particle.y,u * Math.cos(a),u * Math.sin(a));
            }

            
            if(!showVector){
                ctx.beginPath();
                ctx.arc(particle.x*size,particle.y*size,size/2,0,Math.PI*2);
                ctx.fill();
            }
        }
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(0,0,R*size,0,Math.PI*2);
        ctx.fill();

        if(counter > 0.1){        
            createParticles();
            counter = 0;
        }

        counter+= dt;
        timer = getTime();
    },0)
}

function createParticles(){
    for(let i = -height/2; i < height/2; i+=1){
        particles.push({x:width/2, y:i});
    }
}

function drawLine(x,y,dx,dy){
    ctx.beginPath();
    ctx.moveTo(x* size,y* size);
    ctx.lineTo(x*size+dx,y*size+dy);
    ctx.stroke();
}

function canvas_arrow(fromx, fromy, dx, dy) {
    ctx.beginPath();
    var headlen = Math.sqrt(dx**2 + dy**2)/2; // length of head in pixels
    fromx *= size;
    fromy *= size;
    var tox = fromx + dx;
    var toy = fromy + dy;
    var angle = Math.atan2(dy, dx);
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }

function getTime(){
    return new Date().getTime();
}

loop();
