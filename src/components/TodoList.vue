<template>
  <div class="container">
    <div class="row">
      <div class="col-12 py-5">
        <h1>{{ listName }}</h1>
      </div>
    </div>
    <div class="row mb-3">
      <create-todo @on-new-todo="addTodo($event)" />
    </div>
    <div class="row">
      <div class="col-12 col-sm-10 col-lg-6">
        <ul class="list-group">
          <todo
            v-for="(todo, index) in todos"
            :key="index"
            :description="todo.description"
            :completed="todo.completed"
            @on-toggle="toggleTodo(todo)"
            @on-delete="deleteTodo(todo)"
            @on-edit="editTodo(todo, $event)"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Todo from './Todo.vue';
import CreateTodo from './CreateTodo.vue';

/**
 * Basic _TODO_
 *
 * @typedef {{
 *   id: Integer,
 *   description: string,
 *   completed: boolean,
 * }} _TODO_
 */

export default {
  /**
   * All data for current component
   *
   * @returns {{
   *   todos: Array<_TODO_>,
   * }}
   */
  data() {
    return {
      todos: [],
    };
  },

  props: {
    listName: String,
  },

  components: { Todo, CreateTodo },

  methods: {
    /**
     * Adds task to to-do list
     *
     * @param {string} description
     *
     * @returns {Promise<void>}
     */
    async addTodo(description) {
      try {
        const res = await fetch('add-todo', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ description }),
        });

        if (!res.ok) {
          console.error(await res.text());
          return;
        }

        const { id } = await res.json();
        const newTodo = { id, description, completed: false };

        this.todos.push(newTodo);
      } catch (err) {
        console.error(err.message);
      }
    },

    /**
     * Deletes task from to-do list
     *
     * @param {_TODO_} deletedTodo
     *
     * @returns {Promise<void>}
     */
    async deleteTodo(deletedTodo) {
      try {
        const res = await fetch(`delete-todo?id=${deletedTodo.id}`, {
          method: 'POST',
        });

        if (!res.ok) {
          console.error(await res.text());
          return;
        }

        this.todos = this.todos.filter((todo) => todo !== deletedTodo);
      } catch (err) {
        console.error(err.message);
      }
    },

    /**
     * Send request to the server to get all todos
     *
     * @returns {Promise<void>}
     */
    async getTodos() {
      try {
        const res = await fetch('get-todos');
        const data = await res.json();

        this.todos = data.todos;
      } catch (err) {
        console.error(err);
      }
    },

    /**
     * Toggle completeness of task
     *
     * @param {_TODO_} task
     *
     * @return {Promise<void>}
     */
    async toggleTodo(task) {
      try {
        const res = await fetch('edit-todo', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            ...task,
            completed: !task.completed,
          }),
        });

        if (!res.ok) {
          console.error(await res.text());
          return;
        }

        task.completed = !task.completed;
      } catch (err) {
        console.error(err.message);
      }
    },

    /**
     * Edits description of _todo_
     *
     * @param {_TODO_} task
     * @param {string} newTaskDescription
     *
     * @return {Promise<void>}
     */
    async editTodo(task, newTaskDescription) {
      try {
        const res = await fetch('edit-todo', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            ...task,
            description: newTaskDescription,
          }),
        });

        if (!res.ok) {
          console.error(await res.text());
          return;
        }

        task.description = newTaskDescription;
      } catch (err) {
        console.error(err.message);
      }
    },
  },

  async mounted() {
    await this.getTodos();
  },
};
</script>

<style scoped lang="scss"></style>
