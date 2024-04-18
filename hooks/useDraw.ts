import { useCallback, useEffect, useRef, useState } from "react"

type Point = {
	x: number;
	y: number;
}

export const useDraw = (onDraw: (prePoint: null | Point, currentPoint: { x: number, y: number }, ctx: CanvasRenderingContext2D) => void) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const prePoint = useRef<null | Point>(null);
	const [isDraw, setDraw] = useState(false);


	console.log('is draw', isDraw);

	useEffect(() => {
		const computeCanvasPoint = (e: MouseEvent) => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			return { x, y }
		}
		const mouseUpHandler = () => {
			setDraw(false)
			console.log("mouse up");
			prePoint.current = null
		}


		const mouseHandler = (e: MouseEvent) => {
			if (!isDraw) return
			const currentPoint = computeCanvasPoint(e);
			const ctx = canvasRef.current?.getContext("2d")
			if (!ctx || !currentPoint) return;
			onDraw(prePoint.current, currentPoint, ctx)
			prePoint.current = currentPoint;
		}

		if (canvasRef.current) {
			canvasRef.current.addEventListener("mousemove", mouseHandler);
			// canvasRef.current.addEventListener("mousedown", () => setDraw(true))
			window.addEventListener("mouseup", mouseUpHandler)
		}
		return () => {
			if (canvasRef.current) {
				canvasRef.current.removeEventListener("mousemove", mouseHandler)
			}
			window.addEventListener("mouseup", mouseUpHandler)
		}
	}, [isDraw, onDraw])

	return {
		canvasRef,
		setDraw
	}
}