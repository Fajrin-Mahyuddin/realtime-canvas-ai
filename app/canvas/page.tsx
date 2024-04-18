"use client"
import { useDraw } from '@/hooks/useDraw'
import { Box, Center, Flex, Input } from '@chakra-ui/react'
import React, { useState } from 'react'

const CanvasPage = () => {
	const [color, setColor] = useState("#000")
	const { canvasRef } = useDraw(color)
	return (
		<Center gap="10px" alignItems="center" minH="100vh" >
			<Flex flexDir="column" alignItems="flex-start" justifyContent="flex-start">
				<form action="">
					<label htmlFor="head">Pick Colors</label>
					<input type="color" onChange={(e) => setColor(e.currentTarget.value)} id="head" name="line-color" />
				</form>
			</Flex>
			<Box width="512px" height="512px" border="1px solid black">
				<canvas ref={canvasRef} width="512px" height="512px" />
			</Box>
			<Box width="512px" height="512px" border="1px solid black">

			</Box>
		</Center>
	)
}

export default CanvasPage