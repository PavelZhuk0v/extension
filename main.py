import openai
from openai import OpenAI

def process_text(text, reduction):
    api_key = "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"

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    system_instruction = (
        f"Ты — эксперт по лингвистическому анализу и саммаризации.\n"
        f"1. Самостоятельно определи тип, жанр и стиль входящего текста (например, новостная статья, художественная проза, техническая документация, деловое письмо, научная публикация).\n"
        f"2. Сократи этот текст на {reduction}%, адаптируя логику сжатия под его тип: для документов и новостей сохраняй строгие факты, цифры и ключевые тезисы; для художественных текстов — сюжетную линию и суть происходящего; для инструкций — последовательность действий и терминологию.\n"
        f"3. Выведи строго только итоговый сокращенный текст, без упоминания определенного тобой типа и без каких-либо вводных фраз или комментариев."
    )

    try:
        completion = client.chat.completions.create(
            model="nvidia/nemotron-3-super-120b-a12b:free",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": text}
            ]
        )

        if not completion.choices or not completion.choices[0].message.content:
            raise ValueError("Модель вернула пустой ответ. Возможно, она временно перегружена.")

        result = completion.choices[0].message.content

        with open("answer.txt", "w", encoding="utf-8") as file:
            file.write(result)

        return result

    except openai.AuthenticationError:
        raise Exception("Неверный или заблокированный API-ключ OpenRouter. Пожалуйста, обновите ключ в main.py.")
    except openai.RateLimitError:
        raise Exception("Превышен лимит запросов к бесплатной модели. Попробуйте еще раз через минуту.")
    except Exception as e:
        raise Exception(f"Ошибка API OpenRouter: {str(e)}")