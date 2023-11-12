import { Box, ThemeIcon } from '@mantine/core';
import { List } from '@mantine/core';
import useSWR from 'swr';
import './App.css';
import AddTodo from './components/AddTodo';
import { CheckCircleFillIcon } from '@primer/octicons-react';

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

export const ENDPOINT = 'http://localhost:4100';

const fetcher = (url: string) =>
  fetch(`${ENDPOINT}/${url}`).then((r) => r.json());

function App() {
  const { data, mutate } = useSWR<Todo[]>('api/todos', fetcher);

  async function markTodoAsDone(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: 'PATCH',
    }).then((r) => r.json());

    mutate(updated);
  }

  return (
    <Box p='2rem' w='100%' maw='40rem' m='0 auto'>
      <List spacing='xs' size='sm' mb={12} center>
        {data?.map((todo) => {
          return (
            <List.Item
              onClick={() => markTodoAsDone(todo.id)}
              key={`todo__$`}
              icon={
                todo.done ? (
                  <ThemeIcon color='teal' size={24} radius='xl'>
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color='gray' size={24} radius='xl'>
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                )
              }
            >
              {todo.title}
            </List.Item>
          );
        })}
        <AddTodo mutate={mutate} />
        {/* {JSON.stringify(data)} */}
      </List>
    </Box>
  );
}

export default App;
