require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

var imageDatas = require('../data/imageDatas.json');   //获取图片的信息

function getImageURL(imageDatasArr) {  //获取图片的url地址
	for(var i=0 ,j = imageDatasArr.length ; i < j ; i++){
		var singleImageData = imageDatasArr[i];
		//单层提取URL地址,并创建imageURL来存放ImageURl地址
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		//将新的对象重新赋值回去,里面则会多了一个imageURL地址出来
		imageDatasArr[i] = singleImageData;
	}
	//循环换完成之后,重新输出整个imageDatasArr
	//其比之前新增了imageURL
	return imageDatasArr;
}

var imageDatas = getImageURL(imageDatas);  //

//获取区间内的一个随机值
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

class ImgFigure extends React.Component {

	constructor(props) {

		super(props);

	}

	render () {

		var styleObj = {};

		//如果props属性中制定了这张图片的位置,则使用
		if(this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		return (
			<figure className="img-figure" style = {styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} width="100%" />
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		)
	}
}


class AppComponent extends React.Component {
	
	constructor() {
		super();
		//初始化,将所有图片赋值到左上角
		this.Constant = {
			centerPos:{  //中心点
				left:0,
				right:0
			},
			hPosRange:{  //水平方向的取值范围
				leftSecX: [0, 0],
	            rightSecX: [0, 0],
	            y: [0, 0]
			},
			vPosRange:{  //垂直防线的取值范围
				x:[0,0],
				topY:[0,0]
			}
		}

		this.rearrange = this.rearrange.bind(this);
		
		//用于子组件获取style
		this.state = {imgsArrangeArr: [
			// {
			// 	pos:{
	  //           	left:'0',
	  //           	top:'0'
	  //         	},
	  //         	rotate:0, //旋转角度
	  //         	isInverse:false, //正反面,false表示正面
	  //         	isCenter:false //图片是否居中
   	//        	}
        ]}
	}

	/*
	 *重新布局所有图片	
	 *@param centerIndex 指定居中排布那个图片
	 */

	rearrange (centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.leftSecX,
			vPosrangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2),   //取一个或者不取
			topImgSpliceIndex = 0,

			//获取中心图片的状态,剔除中心图片
			imgesArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

		//首先居中 centerIndex 的图片
		imgesArrangeCenterArr[0].pos = centerPos;

		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() *(imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

		//布局位于上侧的图片
		imgsArrangeTopArr.forEach(function (value, index) {
			imgsArrangeTopArr[index].pos = {
				top: getRangeRandom(vPosrangeTopY[0],vPosrangeTopY[1]),
				left:  getRangeRandom(vPosRangeX[0],vPosRangeX[1])
			};
		});

		//布局左右两侧的图片
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
			var hPosrangeLORX = null;

			//前半部分布局左边  右半部分布局右边
			if(i < k) {
				hPosrangeLORX = hPosRangeLeftSecX;

			}
			else{
				hPosrangeLORX = hPosRangeRightSecX;
			}

			imgsArrangeArr[i].pos = {
				top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
				left: getRangeRandom(hPosrangeLORX[0],hPosrangeLORX[1])
			};
		}
		
		//将之前剔除的值,重新合并回来
		if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {  //判断上侧的值是否存在,如果存在则插入回去
			imgsArrangeArr.splice(topImgSpliceIndex, 0 , imgsArrangeTopArr[0]);
		}
		//将中间的值插如回去,因为上侧的值是随机存在的,所以需要if来判断,而中间的值是固定存在的,则不需要判断
		imgsArrangeArr.splice(centerIndex, 0, imgesArrangeCenterArr[0]);

		//然后再来修改整体的布局,也就是所有图片位置重新定义之后,然后再来生成
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		})
	}

	// 组件加载以后, 为每张图片计算器位置的范围
	componentDidMount () {
		
		//拿到组件的大小
		let stageDOM = this.refs.stage,
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		//拿到一个imageFigure的大小

		let imgFigureDOM = this.refs.imgFigure0,
			// imgW = = imgFigureDOM.scrollWidth,
			// imgH = imgFigureDOM.scrollHeight,
			imgW = 320,
			imgH = 360,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		
		//计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		//计算左侧、右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		
		//计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		this.rearrange(0);

	}

  	render() {

		var controllerUnits =[],
			imgFigures = [];

		imageDatas.forEach(function(value,index) {

			if(!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					}
				};
			}
			imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} />)

		}.bind(this));

	    return (
	      <section className="stage" ref="stage">
	      	<section className="img-sec">
				{imgFigures}
	      	</section>
	      	<nav className="controller-nav">
				{controllerUnits}
	      	</nav>
	      </section>
	    );
	  }
	}

AppComponent.defaultProps = {
};

export default AppComponent;
