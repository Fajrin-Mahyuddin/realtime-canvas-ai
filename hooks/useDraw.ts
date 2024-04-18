import { useCallback, useEffect, useRef, useState } from "react"

type Point = {
	x: number;
	y: number;
}

export const useDraw = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const prePoint = useRef<null | Point>(null);
	const [isDraw, setDraw] = useState(false);
	const [lineColor, setLineColor] = useState("#000"); 
	const [imgs, setImg] = useState("")

	const fetchImage = useCallback( async (image: string) => {
		try {
			const req = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations-lcm",
				{
				method: "POST",
				headers: {
					"accept": " application/json",
					"authorization": "Bearer 7b39d9cb-f896-49e3-b57c-4b346178d7a5",
					"content-type": "application/json"
					},
					body: JSON.stringify({
						"width": 512,
						"height": 512,
						"prompt": "Bouquet of pink roses in the garden ",
						"style": "DYNAMIC",
						"strength": 0.7,
						"imageDataUrl": image
					})
			});
			const res = await req.json();
			console.log(res);
			setImg(res.lcmGenerationJob.imageDataUrl)
		} catch (error) {
			console.log("Heeiiii we got trouble", error);
		}
	}, [])

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
	}, [lineColor]);

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

	const mouseUpHandler = useCallback(() => {
		if (canvasRef.current) {
			setDraw(false)
			prePoint.current = null
			let imgs = canvasRef.current.toDataURL("image/jpeg");
			fetchImage(imgs);
		}
	}, [fetchImage])

	useEffect(() => {
		const canRef = canvasRef.current;
		if (canRef) {
			canRef.addEventListener("mousemove", mouseHandler);
			canRef.addEventListener("mousedown", () => setDraw(true))
			window.addEventListener("mouseup", mouseUpHandler)
		}

		return () => {
			canRef?.removeEventListener("mousedown", () => { setDraw(false) });
			canRef?.removeEventListener('mousemove', mouseHandler);
			window.removeEventListener("mouseup", mouseUpHandler)
		}
	}, [mouseHandler, mouseUpHandler])

	return {
		canvasRef,
		lineColor,
		setLineColor,
		imgs
	}
}