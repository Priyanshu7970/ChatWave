
import React from 'react';


export default function Alert({ severity, message }) {
    if (!message) {
        return null; 
    }

    const baseClasses = "p-3 rounded-md mb-4 border text-sm";
    let alertClasses = "";
    let textClasses = "";
    let borderClasses = "";

    switch (severity) {
        case 'success':
            alertClasses = "bg-green-900 bg-opacity-30";
            textClasses = "text-green-300";
            borderClasses = "border-green-500";
            break;
        case 'error':
            alertClasses = "bg-red-900 bg-opacity-30";
            textClasses = "text-red-300";
            borderClasses = "border-red-500";
            break;
        default:
            return null; // Or render a default warning style
    }

    return (
        <p className={`${baseClasses} ${alertClasses} ${textClasses} ${borderClasses}`}>
            {message}
        </p>
    );
}