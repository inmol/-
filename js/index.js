/*
* @Author: inmol
* @Date:   2017-07-25 22:52:06
* @Last Modified by:   inmol
* @Last Modified time: 2017-07-27 11:27:50
*/

'use strict';
var bird = {
	width:40,
	height:28,
	scoreSum:0,
	x:200,
	y:230,
	step:80,
	fly:false,//不在飞行状态
	timeId:null,//鸟自由落体的计时器
	wing : 0//鸟的翅膀的状态，一共有 0 ，1 ，2 三种状态
}
var pillars = [];
//飞翔功能，点击屏幕向上飞一段距离
function fly(){
	var flyTo;
	$(".game-box").click(function(){	
		if(!bird.fly){
			flyTo = bird.y-bird.step;
			bird.fly = true;//更改飞行状态为正在飞
			clearInterval(bird.timeId);//正在飞行，停止自由落体，并清除自由落体计数器
			if(flyTo<=0){//如果要飞出顶部，则停留在顶部
				flyTo = 0;
			}
			$(".bird").animate({
				top:flyTo
			},500,function(){
				bird.y = flyTo;
				bird.fly = false;
				birdDown();
			});
		}
	});
}
//自由落体方法
function birdDown(){
	clearInterval(bird.timeId);
	function down(){
		if(bird.y>=500){//判断鸟是否掉落在了地面下，若是，则鸟死了，游戏结束
			clearInterval(bird.timeId);
			gameOver();
		}else{
			bird.y += 8;
			$(".bird").css("top",bird.y);
		}
	}
	bird.timeId = setInterval(down,40);
}

//背景移动方法
function bgMove(){
	$(".bgi").css("left","0px").animate({
		left:-275
	},4000,"linear",bgMove);
}

//鸟的翅膀扇动效果
function wingChange(){
	var wingTimeId = null;
		wingTimeId = setInterval(function(){
			if(bird.wing == 3 ){
			bird.wing = 0;
		}
		$(".bird").css("backgroundPosition" ,"0px -"+bird.wing * 28+"px");
		bird.wing++;
	}, 300);
}
//柱子对象，因为有很多个柱子，每创建一个柱子，就实例化一个对象
 var pillarObj = function(){
 	this.width = 60;//柱子的宽度
 	this.left = 800;//柱子创建时的位置
 	this.interspaceMax = 180;//空隙的大小
 	this.speed = 5;
 	this.timeId = null;
 	this.pillar = $($("#pliarMode").html());//柱子的jq对象
 	this.score = 0;//单个柱子的得分
 	this.interspaceTop =Math.ceil(Math.random()*200) +50;//随机获取空隙的顶部位置，可以根据这个位置计算碰撞和顶部柱子的定位
 	this.interspaceBottom = this.interspaceTop + this.interspaceMax;
 	this.createPillar = function(){
		this.createInrerspace();
		this.pillar.css("left",this.left);
		$(".game-box").append(this.pillar);
		var that =this;
		this.timeId = setInterval(function(){
			if(that.left>=-60){
				that.birdDie();
				that.left -= that.speed;
				that.pillar.css("left",that.left);
			}else{
				that.pillar.remove();
				clearInterval(that.timeId);
			}
		}, 50);

 	}
 	//定位上下两个柱子
 	this.createInrerspace = function (){
 		this.pillar.find(".pillar-top").css("top",this.interspaceTop - 450);
 		this.pillar.find(".pillar-bottom").css("top",this.interspaceBottom);
 	}
 	//判断鸟的位置，如果鸟不处在空隙之间，就死
 	this.birdDie = function(){
 		if(this.left<=bird.x+bird.width&&this.left>=bird.x-this.width){
 			if(bird.y<this.interspaceTop||bird.y+bird.height>this.interspaceBottom){
 				 gameOver();//游戏结束
 			}
 		}
 		//计算总分
 		if(this.left<bird.x-this.width){
 			this.score = 1;//当前柱子的分数
 			var sum = 0;//总分
 			for(var i = 0; i<pillars.length;i++){
 				sum += pillars[i].score;
 			}
 			bird.scoreSum = sum;
 			if(bird.scoreSum<=9){
 				$(".score").html("得分：0"+bird.scoreSum);
 			}else{
 				$(".score").html("得分："+bird.scoreSum);
 			}
 			
 		}
 	}
 }
 //生成柱子的计时器
 var pillarsTimeId = null;
//创建柱子障碍物，障碍物匀速向右移动
function createPillar(){
	clearInterval(pillarsTimeId);
	var num = 0;
	pillarsTimeId = setInterval(function(){
		pillars[num] = new pillarObj();
		pillars[num].createPillar();
		num++;
	}, 2500);
}
//游戏结束
function gameOver(){
	for(var i=0;i<pillars.length;i++){
		clearInterval(pillars[i].timeId);
	}
	clearInterval(pillarsTimeId);
	 $('.game-box').unbind("click"); 
	$(".game-over").show();
}
//游戏开始
function gameStart(){
	$(".game-start").click(function(){
		birdDown();
		createPillar();
		bgMove();
		fly();
		$(this).hide();
	});
}

//主函数
$(function(){
	console.log("这是一个寂寞的天，下着有些伤心的雨。");
	console.log("作者：inmol");
	gameStart();
	wingChange();
});