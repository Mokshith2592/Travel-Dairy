import React from 'react'

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^s@]+\.[^\s@]+$/

    return regex.test(email);
}

export const getInitials = (name) => {
    if(!name) return "";

    const words = name.split(" ");
    let initials = ""
    // console.log(words);
    for(let i=0 ;i<Math.min(words.length ,2) ;i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
}

export const getEmptyCardMessage = (filterType) => {
    switch (filterType) {
        case "search":
            return "Opps! No notes found!"
        case "date": 
            return "No notes found in the given date range"
        default:
            "Start creating your first travel story! Click the 'Add' button to write down your thoughts, ideas and memories. Let's get started!"
    }
}
export default  validateEmail