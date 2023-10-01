'use client'
import React, {useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {uploadToS3} from '@/lib/s3'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import {Inbox, Loader2} from 'lucide-react'

const FileUpload = () => {
	const [upLoading, setUpLoading] = useState(false)

	// POST request to send file key and file name
	const {mutate, isLoading} = useMutation({
		mutationFn: async ({
			file_key,
			file_name,
		}: {
			file_key: string
			file_name: string
		}) => {
			const response = await axios.post(
				'/api/create-chat',
				{
					file_key,
					file_name,
				}
			)
			return response.data
		},
	})

	const {getInputProps, getRootProps} = useDropzone({
		accept: {'application/pdf': ['.pdf']},
		maxFiles: 1,
		onDrop: async (acceptedFiles) => {
			console.log(acceptedFiles)
			const file = acceptedFiles[0]
			if (file.size > 10 * 1024 * 1024) {
				//bigger than 10MB
				toast.error('File too large!')
				return
			}
			try {
				setUpLoading(true)
				const data = await uploadToS3(file)
				// send file key and name
				if (!data?.file_key || !data?.file_name) {
					toast.error('Something went wrong')
					return
				}
				mutate(data, {
					onSuccess: (data) => {
						console.log(data)
						toast.success(data.message);
					},
					onError: (err) => {
						toast.error('Error creating chat')
						console.log(err)
					},
				})
				console.log('data', data)
			} catch (error) {
				console.log(error)
			} finally {
				setUpLoading(false)
			}
		},
	})

	return (
		<div className='p-2 bg-white rounded-xl'>
			<div
				{...getRootProps({
					className:
						'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
				})}>
				<input {...getInputProps()} />
				{upLoading || isLoading ? (
					<>
						<Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
						<p className='mt-2 text-sm text-slate-400'>
							Spilling tea to GPT...
						</p>
					</>
				) : (
					<>
						<Inbox className='w-8 h-8 text-blue-600' />
						<p className='mt-2 text-sm text-slate-500'>
							Drop files here!
						</p>
					</>
				)}
			</div>
		</div>
	)
}

export default FileUpload
