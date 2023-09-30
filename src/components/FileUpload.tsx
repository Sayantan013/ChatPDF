'use client'
import React, {useCallback} from 'react'
import {Inbox} from 'lucide-react'
import {useDropzone} from 'react-dropzone'

const FileUpload = () => {
	const {acceptedFiles, getInputProps, getRootProps} =
		useDropzone({
			accept: {'application/pdf': ['.pdf']},
			maxFiles: 1,
			onDrop: (acceptedFiles) =>
				console.log(acceptedFiles),
		})

	return (
		<div className='p-2 bg-white rounded-xl'>
			<div
				{...getRootProps({
					className:
						'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
				})}>
				<input {...getInputProps()} />
				<>
					<Inbox className='w-8 h-8 text-blue-600' />
					<p className='mt-2 text-sm text-slate-500'>
						Drop files here!
					</p>
				</>
			</div>
		</div>
	)
}

export default FileUpload
