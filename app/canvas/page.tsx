"use client"
import React, { useEffect, useState } from 'react'
import { useDraw } from '@/hooks/useDraw'
import { Box, Center, Flex, Input } from '@chakra-ui/react'

const CanvasPage = () => {
	const { canvasRef, setLineColor, lineColor } = useDraw();

	return (
		<Center gap="10px" alignItems="center" minH="100vh">
			<InputColor value={lineColor} onUpdate={(e:string) => setLineColor(e)} />
			<Box width="512px" height="512px" border="1px solid black">
				<canvas ref={canvasRef} width="512px" height="512px" />
			</Box>
			<Box width="512px" height="512px" border="1px solid black">
			
			</Box>
		</Center>
	)
}

const InputColor = ({value, onUpdate}: {value: string, onUpdate: (e:string) => void}) => {
	const [isRender, setRender] = useState(false);

	useEffect(() => {
		setRender(true);
	}, [])

	if (!isRender) {
		return <>Loading</>
	}
	return (
		<Flex>
			<label>Line Color</label>
			<input type="color" name="linecolor" defaultValue={value} onChange={(e) => onUpdate(e.currentTarget.value)} />	
		</Flex>
	)
}

export default CanvasPage