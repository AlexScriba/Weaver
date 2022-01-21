import printTest from '../lib/WeaverApp';

// TODO ::: create "compiler" to make add this script to html file
const content = document.getElementById('content');

if (content) content.innerHTML = 'Hello world';
printTest();
