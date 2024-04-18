"use client"
import { useDraw } from '@/hooks/useDraw'
import { Box, Center } from '@chakra-ui/react'
import React from 'react'

type Point = {
	x: number;
	y: number;
}

const CanvasPage = () => {
	const drawLine = (prePoint: null | Point, currentPoint: { x: number, y: number }, ctx: CanvasRenderingContext2D) => {
		const { x, y } = currentPoint;
		let start = prePoint ?? currentPoint;
		const lineColor = "#000";
		const lineWidth = 5;

		ctx.beginPath();
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = lineColor;

		ctx.moveTo(start.x, start.y);
		ctx.lineTo(x, y)
		ctx.stroke();

		ctx.fillStyle = lineColor
		ctx.beginPath()
		ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI)
		ctx.fill()
	}

	const { canvasRef, setDraw } = useDraw(drawLine);
	return (
		<Center gap="10px" alignItems="center" minH="100vh" >
			<Box width="512px" height="512px" border="1px solid black">
				<canvas ref={canvasRef} onMouseUp={() => setDraw(false)} onMouseDown={() => setDraw(true)} width="512px" height="512px" />
			</Box>
			<Box width="512px" height="512px" border="1px solid black">

			</Box>
		</Center>
	)
}

export default CanvasPage