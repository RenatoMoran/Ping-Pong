// Selecionar o canvas
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

let comScore = new Audio();
let userScore = new Audio();
let wall = new Audio();
let hit = new Audio();

comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";
wall.src = "sounds/wall.mp3";
hit.src = "sounds/hit.mp3";

// Criando o usuário
const user = {
	x : 0,
	y : cvs.height/2 - 100/2,
	width : 10,
	height : 100,
	color : "WHITE",
	score : 0
}

// Criando o oponente
const com = {
	x : cvs.width - 10,
	y : cvs.height/2 - 100/2,
	width : 10,
	height : 100,
	color : "WHITE",
	score : 0
}

// Criando a bola
const ball = {
	x : cvs.width/2,
	y : cvs.height/2,
	radius : 10,
	speed : 5,
	velocityX : 5,
	velocityY : 5,
	color : "WHITE"
}

// Função que desenha o retângulo
function drawRect(x,y,w,h,color) {
	ctx.fillStyle = color;
	ctx.fillRect(x,y,w,h);
}

// Cria a rede
const net = {
	x : cvs.width/2 - 1,
	y : 0,
	width : 2,
	height : 10,
	color : "WHITE"
}

// Função que chama a rede
function drawNet(){
	for (let i = 0; i <= cvs.height; i+=15) {
		drawRect(net.x, net.y + i, net.width, net.height, net.color);
	}
}

// Desenha o circulo
function drawCircle(x,y,r,color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x,y,r,0,Math.PI*2,false);
	ctx.closePath();
	ctx.fill();
}

// Desenha o texto
function drawText(text,x,y,color) {
	ctx.fillStyle = color;
	ctx.font = "45px fantasy";
	ctx.fillText(text,x,y);
}

// Renderiza o jogo
function render(){
	// Cria o canvas
	drawRect(0,0, cvs.width, cvs.height, "BLACK");

	// Desenha a rede
	drawNet();

	// Cria a pontuação
	drawText(user.score, cvs.width/4, cvs.height/5, "WHITE");
	drawText(com.score, 3*cvs.width/4, cvs.height/5, "WHITE");

	// Desenha os jogodores
	drawRect(user.x, user.y, user.width, user.height, user.color);
	drawRect(com.x, com.y, com.width, com.height, com.color);

	// Desenha a bola
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// controle do usuário
cvs.addEventListener("mousemove",movePaddle);

function movePaddle(evt) {
	let rect = cvs.getBoundingClientRect();

	user.y = evt.clientY - rect.top - user.height/2;

}

// Criando o detector de colisão
function collision(b,p) {
	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;

	p.top = p.y;
	p.bottom = p.y + p.height;

	p.left = p.x;
	p.right = p.x + p.width;

	return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// Reseta a bola
function resetBall() {
	ball.x = cvs.width/2;
	ball.y = cvs.height/2;

	ball.speed = 5;
	ball.velocityX = -ball.velocityX;
}

// Update: pos, mov, score ...
function update() {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	// Simples inteligência artificial para controlar o inimigo
	let computerLevel = 0.1;
	com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

	if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
		ball.velocityY = -ball.velocityY;
	}

	let player = (ball.x < cvs.width/2) ? user : com;

	if(collision(ball, player)){
		wall.play();
		// Onde todos os hits do player
		let collidePoint = ball.y - (player.y + player.height/2);

		// normalização
		collidePoint = collidePoint / (player.height/2);

		// Calcular o ângulo em radius
		let angleRad = collidePoint * Math.PI/4;

		// Direção da bola quando o hit acontece
		let direction = (ball.x < cvs.width/2) ? 1 : -1;

		// Trocar velocidade X e Y
		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = 			 ball.speed * Math.sin(angleRad);

		// todas as vezes que a bola der um hit vai aumentar seu speed
		ball.speed += 0.5;

	}

		// Aumentar o score
		if( ball.x - ball.radius < 0 ){
			// Inimigo venceu
			com.score++;
			comScore.play();
			resetBall();
		}else if( ball.x + ball.radius > cvs.width ){
			// Player venceu
			user.score++;
			userScore.play();
			resetBall();
		}
}

// Função que inicia o jogo
function game(argument) {
	update();
	render();
}

// Loop
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);