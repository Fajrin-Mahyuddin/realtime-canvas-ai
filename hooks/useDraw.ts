import { useCallback, useEffect, useRef, useState } from "react"

type Point = {
	x: number;
	y: number;
}

export const useDraw = (color: string) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const prePoint = useRef<null | Point>(null);
	const [isDraw, setDraw] = useState(false);
	// const [lineColor, setLineColor] = useState(color); 
	let lineColor = color

	const drawLine = useCallback((prePoint: null | Point, currentPoint: { x: number, y: number }, ctx: CanvasRenderingContext2D) => {
		const { x, y } = currentPoint;
		let start = prePoint ?? currentPoint;
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
		ctx.fill();
		if (canvasRef.current) {
			let imgs = canvasRef.current.toDataURL();
			fetchImage(imgs);
		}

	}, [lineColor]);

	const fetchImage = async (image: string) => {
		try {
			const req = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations-lcm", {
				headers: {
					"accept": " application/json",
					"authorization": "Bearer 7b39d9cb-f896-49e3-b57c-4b346178d7a5",
					"content-type": "application/json"
				}
			});
			const res = req.json();
			console.log(res);
		} catch (error) {
			console.log("Heeiiii we got trouble", error);
		}
	}

	const mouseHandler = useCallback((e: MouseEvent) => {
		if (!isDraw) return
		const currentPoint = computeCanvasPoint(e);
		const ctx = canvasRef.current?.getContext("2d")
		if (!ctx || !currentPoint) return;
		drawLine(prePoint.current, currentPoint, ctx)
		prePoint.current = currentPoint
	}, [drawLine, isDraw])



	const computeCanvasPoint = (e: MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		return { x, y }
	}

	useEffect(() => {
		const canRef = canvasRef.current;
		if (canRef) {
			canRef.addEventListener("mousemove", mouseHandler);
			canRef.addEventListener("mousedown", () => setDraw(true))
			window.addEventListener("mouseup", () => {
				setDraw(false)
				prePoint.current = null
			})
		}

		return () => {
			canRef?.removeEventListener("mousedown", () => { setDraw(false) });
			canRef?.removeEventListener('mousemove', mouseHandler);
			window.removeEventListener("mouseup", () => {
				setDraw(false);
				prePoint.current = null
			})
		}
	}, [mouseHandler])

	return {
		canvasRef,
	}
}