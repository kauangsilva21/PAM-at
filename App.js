import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todo_list_items';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos)).catch(console.error);
  }, [todos]);

  const loadTodos = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setTodos(JSON.parse(data));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const addTodo = () => {
    const task = text.trim();
    if (!task) return;

    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: `${Date.now()}-${Math.random()}`,
        text: task,
      },
    ]);
    setText('');
    Keyboard.dismiss();
  };

  const deleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FC" />

      <Text style={styles.title}>Lista de tarefas</Text>
      <Text style={styles.subtitle}>Organize seu dia</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Adicionar tarefa..."
          placeholderTextColor="#7BA3C0"
          returnKeyType="done"
          onSubmitEditing={addTodo}
        />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Minhas atividades</Text>
        <Text style={styles.counter}>
          {todos.length} {todos.length === 1 ? 'tarefa' : 'tarefas'}
        </Text>
      </View>

      <FlatList
        style={styles.list}
        data={todos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhuma tarefa por enquanto.{'\n'}Digite e pressione Enter para adicionar.
          </Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.todoItem}>
            <View style={styles.taskNumber}>
              <Text style={styles.taskNumberText}>{index + 1}</Text>
            </View>

            <Text style={styles.todoText}>{item.text}</Text>

            <TouchableOpacity
              onPress={() => deleteTodo(item.id)}
              style={styles.deleteButton}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FC',
    paddingTop: 60,
    paddingHorizontal: 22,
    paddingBottom: 12,
  },
  title: {
    color: '#1E5F8A',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: '#5BA3C5',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A8D4EC',
    borderRadius: 0,
    padding: 0,
    marginBottom: 22,
  },
  input: {
    color: '#1E5F8A',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listTitle: {
    color: '#1E5F8A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counter: {
    color: '#5BA3C5',
    fontSize: 13,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  empty: {
    color: '#7BA3C0',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    lineHeight: 22,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B8D9EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  taskNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5BA3C5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  taskNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  todoText: {
    color: '#1E5F8A',
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#E8F4FC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A8D4EC',
  },
  deleteText: {
    color: '#1E5F8A',
    fontSize: 12,
    fontWeight: 'bold',
  },
});