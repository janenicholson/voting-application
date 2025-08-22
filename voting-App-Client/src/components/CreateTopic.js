// src/components/CreateTopic.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Importing Framer Motion
import { API_URL } from '../config';

const CreateTopic = () => {
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [votingUrl, setVotingUrl] = useState('');
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_URL;
    console.log('API URL:', apiUrl);


    const createTopic = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/topics`, { topic, description });
            setVotingUrl(response.data.votingUrl);
            setMessage('Topic created! Copy the voting link below.');
        } catch (error) {
            setMessage('Error creating topic');
        }
    };

    const copyToClipboard = () => {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(votingUrl)
                .then(() => alert('Link copied to clipboard!'))
                .catch(err => {
                    console.error('Clipboard API failed:', err);
                    fallbackCopyTextToClipboard(votingUrl);
                });
        } else {
            // Fallback for older browsers or non-HTTPS contexts
            fallbackCopyTextToClipboard(votingUrl);
        }
    };

    const fallbackCopyTextToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                alert('Link copied to clipboard!');
            } else {
                alert('Failed to copy link. Please copy manually: ' + text);
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            alert('Copy failed. Please copy manually: ' + text);
        }

        document.body.removeChild(textArea);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Create Voting Topic</h1>
            <form onSubmit={createTopic} className="bg-white p-6 rounded-lg shadow-md">
                <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                    placeholder="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                />
                <textarea
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit" className="bg-blue-500 text-white rounded-lg p-2">Create Topic</button>
            </form>
            {message && (
                <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <p className="text-green-600">{message}</p>
                    {votingUrl && (
                        <div className="mt-2">
                            <p className="text-gray-700 mb-2">Voting Link:</p>
                            <div className="bg-gray-100 p-2 rounded border mb-2">
                                <input
                                    type="text"
                                    value={votingUrl}
                                    readOnly
                                    className="w-full bg-transparent border-none outline-none text-blue-600 cursor-pointer"
                                    onClick={(e) => e.target.select()}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="bg-green-500 text-white rounded-lg p-2 hover:bg-green-600"
                                    onClick={copyToClipboard}
                                >
                                    Copy Link
                                </button>
                                <button
                                    className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
                                    onClick={() => window.open(votingUrl, '_blank')}
                                >
                                    Open Link
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default CreateTopic;
