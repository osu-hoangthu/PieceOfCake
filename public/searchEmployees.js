function searchEmps() {
    var emp_search  = document.getElementById('emp_search').value;
    window.location = '/employees/' + encodeURI(emp_search);
}
