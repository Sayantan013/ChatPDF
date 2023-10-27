'use client';
import React, {useState} from 'react';
import {Inbox, Loader2} from 'lucide-react';
import {useDropzone} from 'react-dropzone';
import {uploadToS3} from '@/lib/s3';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const FileUpload = () => {
	const [uploading, setUploading] =
		useState<boolean>(false);
	useState<boolean>(false);
	const {mutate, isLoading} = useMutation({
		mutationFn: async ({
			file_key,
			file_name,
		}: {
			file_key: string;
			file_name: string;
		}) => {
			const response = await axios.post(
				'/api/create-chat',
				{file_key, file_name}
			);
		},
	});

	const {acceptedFiles, getInputProps, getRootProps} =
		useDropzone({
			accept: {'application/pdf': ['.pdf']},
			maxFiles: 1,
			onDrop: async (acceptedFiles) => {
				console.log(acceptedFiles);
				const file = acceptedFiles[0];

				if (file.size > 10 * 1024 * 1024) {
					//bigger than 10MB
					toast.error(
						"File can't be bigger than 10MB"
					);
					return;
				}

				try {
					// File is still uploading
					setUploading(true);
					const data = await uploadToS3(file);
					// Error retrieving file details for fetch calls
					if (
						!data?.file_key ||
						!data.file_name
					) {
						toast.error(
							'File contents inappropriate'
						);
						return;
					}
					mutate(data, {
						onSuccess: (data) => {
							toast.success(
								'File uploaded successfully'
							);
							console.log(data);
						},
						onError: (error) => {
							toast.error(
								'Error creating chat'
							);
							console.log(error);
						},
					});
				} catch (error) {
					toast.error('File upload failed');
					console.log(error);
				} finally {
					// File uploading done
					setUploading(false);
				}
			},
		});

	return (
		<div className='p-2 bg-white rounded-xl'>
			<div
				{...getRootProps({
					className:
						'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
				})}>
				<input {...getInputProps()} />
				{uploading && isLoading ? (
					<>
						<Loader2 className='w-10 h-10 text-slate-400' />
						<p>Spilling to GPT...</p>
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
	);
};

export default FileUpload;
