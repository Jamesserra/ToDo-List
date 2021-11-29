let getAndDisplayAllTasks = function () {
  $.ajax({
    type: 'GET',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=208',
    dataType: 'json',
    success: function (response, textStatus) {
      $('#todo-list').empty();

      let activeTasks = response.tasks.filter(function (task) {
        if (!task.completed) {
          return task.id;
        }
      });
      let completedTasks = response.tasks.filter(function (task) {
        if (task.completed) {
          return task.id;
        }
      });

      let filterID = $('.active').attr('id');

      if (filterID === 'all' || filterID === '') {
        taskItems = response.tasks;
      }
      if (filterID === 'active') {
        taskItems = activeTasks;
      }
      if (filterID === 'completed') {
        taskItems = completedTasks;
      }

      let sortedFilter = taskItems.sort(function (a, b) {
        return Date.parse(a.created_at) - Date.parse(b.created_at);
      });

      sortedFilter.forEach(function (task) {
        $('#todo-list').append('<div class="row"><p class="col-xs-8">' + task.content + '</p><button type="button"  class="delete btn btn-danger btn-lg remove" data-id="' + task.id + '"><i class="fas fa-times"></i></button><input type="checkbox" class="mark-complete largerCheckbox" data-id="' + task.id + '"' + (task.completed ? 'checked' : '') + '>');
      })
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

let createTask = function () {
  $.ajax({
    type: 'POST',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=208',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      task: {
        content: $('#new-task-content').val()
      }
    }),
    success: function (response, textStatus) {
      $('#new-task-content').val('');
      getAndDisplayAllTasks();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

let deleteTask = function (id) {
  $.ajax({
    type: 'DELETE',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=208',
    success: function (response, textStatus) {
      getAndDisplayAllTasks();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

let markTaskComplete = function (id) {
  $.ajax({
    type: 'PUT',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_complete?api_key=208',
    dataType: 'json',
    success: function (response, textStatus) {
      getAndDisplayAllTasks();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

let markTaskActive = function (id) {
  $.ajax({
    type: 'PUT',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_active?api_key=208',
    dataType: 'json',
    success: function (response, textStatus) {
      getAndDisplayAllTasks();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

let filterResults = function () {
  $(this).addClass('active');
  $(this).siblings().removeClass('active');
  getAndDisplayAllTasks();
}

$(document).ready(function () {

  getAndDisplayAllTasks();

  $('#create-task').on('submit', function (e) {
    e.preventDefault();
    createTask();
  });

  $(document).on('click', '.delete', function () {
    deleteTask($(this).data('id'));
  });

  $(document).on('change', '.mark-complete', function () {
    if (this.checked) {
      markTaskComplete($(this).data('id'));
    } else {
      markTaskActive($(this).data('id'));
    }
  });

  $('.filterContainer button').on('click', filterResults);
});