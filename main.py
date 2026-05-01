from openai import OpenAI

#Заглушки для основных функций
text = input()
userInput = 80

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="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",
)

completion = client.chat.completions.create(
  model = "nvidia/nemotron-3-super-120b-a12b:free",
  messages = [
    {"role": "system", "content": f'Твоя задача помочь человеку понять суть огромного текста. '
                                  f'Пользователь выбирает на сколько сократить текст в процентах, а ты должен выполнить.'
                                  f'Основной запрос: Сократи текст на {userInput}%, сохранив всю суть'},
    {"role": "user", "content": text}
  ]
)

result = completion.choices[0].message.content

with open("answer.txt", 'w', encoding='utf-8') as file:
  file.write(result)
