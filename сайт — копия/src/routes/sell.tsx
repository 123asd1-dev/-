import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, UserPlus, ScrollText, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Разместить объявление — GameMart" },
      { name: "description", content: "Продайте свой игровой товар на GameMart за пару минут." },
    ],
  }),
  component: SellPage,
});

type Step = "register" | "rules" | "form" | "done";

const STORAGE_KEY = "gamemart:account";
const RULES_KEY = "gamemart:rules-accepted";

type Account = { email: string; nickname: string };

function SellPage() {
  const [step, setStep] = useState<Step>("register");
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const rulesOk = localStorage.getItem(RULES_KEY) === "1";
      if (raw) {
        const acc = JSON.parse(raw) as Account;
        setAccount(acc);
        setStep(rulesOk ? "form" : "rules");
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Link>

        <Stepper step={step} />

        {step === "register" && (
          <RegisterStep
            onDone={(acc) => {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(acc));
              setAccount(acc);
              setStep("rules");
            }}
          />
        )}

        {step === "rules" && (
          <RulesStep
            nickname={account?.nickname ?? ""}
            onAccept={() => {
              localStorage.setItem(RULES_KEY, "1");
              setStep("form");
            }}
          />
        )}

        {step === "form" && <FormStep onDone={() => setStep("done")} />}

        {step === "done" && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Объявление отправлено!</h1>
            <p className="mt-2 text-muted-foreground">
              Демо — в реальной версии оно появится в каталоге после модерации.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-secondary"
            >
              На главную
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const order: Step[] = ["register", "rules", "form"];
  const idx = step === "done" ? 2 : order.indexOf(step);
  const labels = ["Аккаунт", "Правила", "Объявление"];
  return (
    <div className="mb-6 flex items-center gap-2">
      {labels.map((l, i) => (
        <div key={l} className="flex flex-1 items-center gap-2">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              i <= idx
                ? "text-primary-foreground"
                : "border border-border bg-secondary text-muted-foreground"
            }`}
            style={i <= idx ? { background: "var(--gradient-primary)" } : undefined}
          >
            {i + 1}
          </div>
          <span className={`truncate text-xs ${i <= idx ? "font-medium" : "text-muted-foreground"}`}>
            {l}
          </span>
          {i < labels.length - 1 && <div className="h-px flex-1 bg-border" />}
        </div>
      ))}
    </div>
  );
}

function RegisterStep({ onDone }: { onDone: (a: Account) => void }) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email || !nickname || password.length < 6) return;
        onDone({ email, nickname });
      }}
      className="space-y-5 rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Регистрация продавца</h1>
          <p className="text-xs text-muted-foreground">Чтобы выставить товар, нужен аккаунт</p>
        </div>
      </div>

      <Field label="Никнейм">
        <input
          required
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={32}
          placeholder="ProGamer"
          className={inputCls}
        />
      </Field>

      <Field label="Email">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputCls}
        />
      </Field>

      <Field label="Пароль (минимум 6 символов)">
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          placeholder="••••••••"
          className={inputCls}
        />
      </Field>

      <button
        type="submit"
        className="w-full rounded-xl py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        Создать аккаунт
      </button>
    </form>
  );
}

function RulesStep({ nickname, onAccept }: { nickname: string; onAccept: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <ScrollText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Правила площадки</h1>
          <p className="text-xs text-muted-foreground">
            {nickname ? `Привет, ${nickname}! ` : ""}Прочитайте до конца, чтобы продолжить
          </p>
        </div>
      </div>

      <div
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setScrolled(true);
        }}
        className="mt-5 h-80 overflow-y-auto rounded-xl border border-border bg-secondary/30 p-4 text-sm leading-relaxed"
      >
        <RulesContent />
      </div>

      {!scrolled && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Прокрутите правила до конца ↓
        </p>
      )}

      <label
        className={`mt-4 flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
          scrolled ? "border-border bg-secondary/40" : "border-border/50 bg-secondary/20 opacity-60"
        }`}
      >
        <input
          type="checkbox"
          disabled={!scrolled}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span className="text-sm">
          Я прочитал(а) правила и согласен(а) их соблюдать. Понимаю, что нарушение влечёт блокировку
          аккаунта и отказ в выплатах.
        </span>
      </label>

      <button
        onClick={onAccept}
        disabled={!checked || !scrolled}
        className="mt-4 w-full rounded-xl py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        Принять и продолжить
      </button>
    </div>
  );
}

function FormStep({ onDone }: { onDone: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onDone();
      }}
      className="space-y-5 rounded-2xl border border-border bg-card p-6"
    >
      <div>
        <h1 className="text-xl font-bold">Новое объявление</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Заполните поля — покупатели увидят товар сразу после публикации.
        </p>
      </div>

      <Field label="Название">
        <input required maxLength={120} placeholder="Аккаунт уровня 100 со всеми скинами" className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Игра">
          <input required placeholder="Aetheria Online" className={inputCls} />
        </Field>
        <Field label="Цена, ₽">
          <input required type="number" min={1} placeholder="999" className={inputCls} />
        </Field>
      </div>

      <Field label="Количество в наличии">
        <input required type="number" min={1} defaultValue={1} className={inputCls} />
      </Field>

      <Field label="Описание">
        <textarea
          required
          rows={5}
          maxLength={2000}
          placeholder="Опишите лот, как происходит передача, какие гарантии..."
          className={`${inputCls} resize-none`}
        />
      </Field>

      <Field label="Фото товара">
        <label className="flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-input/40 transition hover:border-primary/60">
          {preview ? (
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <div className="text-center text-muted-foreground">
              <ImagePlus className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">Нажмите, чтобы загрузить</p>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} />
        </label>
      </Field>

      <button
        type="submit"
        className="w-full rounded-xl py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        Опубликовать
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-input/60 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function RulesContent() {
  return (
    <div className="space-y-4 text-muted-foreground">
      <Section title="1. Общие правила">
        <Rule code="1.1" text="Передача другому пользователю контактных данных (Telegram, Discord, ВК, телефон) любым способом. Связь в игре после выполнения заказа." sanction="Временная блокировка, при повторе — блокировка аккаунта и отказ в выплатах." />
        <Rule code="1.2" text="Недобросовестное использование системы отзывов (накрутка, шантаж, безосновательное изменение отзыва)." sanction="Удаление отзыва. Блокировка при повторе." />
        <Rule code="1.3" text="Передача третьим лицам или разглашение информации о пользователе с целью вреда." sanction="Блокировка всех аккаунтов. Отказ в выплатах." />
        <Rule code="1.4" text="Попытка покупки или продажи аккаунта нашего сайта." sanction="Блокировка всех аккаунтов." />
        <Rule code="1.5" text="Размещение на аватаре ссылок, противозаконной, порнографической или политической информации." sanction="Удаление аватара. Блокировка при повторе." />
        <Rule code="1.6" text="Упоминание в имени ссылок, противозаконной или политической информации." sanction="Переименование." />
        <Rule code="1.7" text="Нарушения в общем чате: продажа, реклама, спам, оскорбления, политика." sanction="Блокировка общего чата, далее — блокировка аккаунта." />
        <Rule code="1.8" text="Оскорбления, угрозы, спам, флуд в личном чате." sanction="Предупреждение, далее — временная блокировка." />
        <Rule code="1.9" text="Реклама, спам, массовая рассылка пользователям." sanction="Временная или постоянная блокировка." />
        <Rule code="1.10" text="Мошенничество и обман других пользователей." sanction="Блокировка всех аккаунтов. Отказ в выплатах." />
        <Rule code="1.11" text="Обмен денежных средств между платёжными системами без цели заказа. Кардинг." sanction="Блокировка всех аккаунтов. Отказ в выплатах." />
        <Rule code="1.12" text="Передача ссылок на файлообменники без явной необходимости." sanction="Предупреждение, далее — блокировка." />
      </Section>

      <Section title="2.1. Запрещённые действия продавцов">
        <Rule code="2.1.1" text="Передача товара или услуги без проведения платежа через площадку. Обмен товарами." sanction="Блокировка всех аккаунтов. Отказ в выплатах." />
        <Rule code="2.1.2" text="Просьба к покупателю о подтверждении заказа до фактического выполнения." sanction="Временная блокировка. Отключение мгновенного вывода." />
        <Rule code="2.1.3" text="Недобросовестная борьба с конкурентами (фейк-заказы, отзывы, жалобы)." sanction="Временная блокировка." />
        <Rule code="2.1.4" text="Беспричинное игнорирование вопросов покупателей." sanction="Предупреждение, далее — временная блокировка." />
        <Rule code="2.1.5" text="Размещение недействительных предложений или цен." sanction="Временная блокировка, возможна постоянная." />
        <Rule code="2.1.6" text="Некорректное английское описание товара (например, из одной буквы)." sanction="Предупреждение, далее — удаление предложений." />
        <Rule code="2.1.7" text="Посторонняя информация в поле «товары» автоматической выдачи." sanction="Предупреждение, далее — блокировка." />
        <Rule code="2.1.8" text="«Автовыдача» для товаров, требующих общения или доп. услуг." sanction="Предупреждение, далее — блокировка." />
        <Rule code="2.1.9" text="Нарушение правил на странице размещения, игнорирование уведомлений." sanction="Удаление предложений, предупреждение." />
        <Rule code="2.1.10" text="Дублирование предложений, засорение таблицы, объявления о покупке." sanction="Удаление предложений, далее — блокировка." />
        <Rule code="2.1.11" text="Продажа через раздел не по назначению (валюта в разделе предметов)." sanction="Доначисление комиссии, далее — блокировка." />
        <Rule code="2.1.12" text="Размещение объявлений на других торговых площадках." sanction="Блокировка аккаунта. Отказ в выплатах." />
        <Rule code="2.1.13" text="Изображения с противозаконным, экстремистским, порно- или политическим содержимым." sanction="Удаление, далее — блокировка." />
        <Rule code="2.1.14" text="Любая информация, нарушающая права третьих лиц." sanction="Удаление, при многократных нарушениях — блокировка." />
      </Section>

      <Section title="2.2. Запрещённые категории товаров">
        <Rule code="2.2.1" text="Товары, полученные неправомерным путём (взлом, брут, кардинг)." sanction="Блокировка + идентификация для выплат в течение 60 дней." />
        <Rule code="2.2.2" text="Обучение неправомерной деятельности (дюпы, кардинг)." sanction="Блокировка + идентификация (60 дней)." />
        <Rule code="2.2.3" text="Продажа персональных данных." sanction="Блокировка + идентификация (60 дней)." />
        <Rule code="2.2.4" text="Нелицензионное и/или вредоносное ПО." sanction="Блокировка + идентификация (30 дней)." />
        <Rule code="2.2.5" text="Аккаунты соцсетей и подписки на онлайн-кинотеатры (без спец. раздела)." sanction="Блокировка + идентификация (30 дней)." />
        <Rule code="2.2.6" text="Телефонные номера РФ/Украины/Беларуси, в т.ч. виртуальные." sanction="Блокировка + идентификация (30 дней)." />
        <Rule code="2.2.7" text="Аккаунты оптом (кроме зарегистрированных лично)." sanction="Блокировка + идентификация (30 дней)." />
        <Rule code="2.2.8" text="Эротическое или порнографическое содержимое." sanction="Блокировка + идентификация (30 дней)." />
        <Rule code="2.2.9" text="Услуги спама и массовых рассылок." sanction="Блокировка + идентификация (30 дней)." />
        <Rule code="2.2.10" text="Ставки и казино." sanction="Блокировка + идентификация (30 дней)." />
        <Rule code="2.2.11" text="Способы доната и накрутки." sanction="Блокировка + идентификация (30 дней)." />
        <Rule code="2.2.12" text="Перепродажа оффлайн-активаций, геймпассов." sanction="Предупреждение, далее — блокировка." />
        <Rule code="2.2.13" text="Лотереи, розыгрыши, продажа «рандома»." sanction="Предупреждение, далее — блокировка." />
        <Rule code="2.2.14" text="Криптовалюта." sanction="Предупреждение, далее — блокировка." />
      </Section>

      <Section title="3. Ответственность продавцов">
        <Rule code="3.1.1" text="Отказ от задач арбитража, безучастность при споре." sanction="Возврат до 100% суммы заказа." />
        <Rule code="3.1.2" text="Отказ от консультирования покупателя, игнорирование вопросов." sanction="Возврат до 100% суммы заказа." />
        <Rule code="3.2.1" text="Санкции игры из-за нелегально полученной валюты/предметов." sanction="Возврат до 100%." />
        <Rule code="3.2.2" text="Санкции игры из-за самого факта покупки валюты/предметов." sanction="Возврат до 50%." />
        <Rule code="3.2.3" text="Покрытие внутриигровой комиссии за передачу валюты — на продавце." sanction="Возврат суммы комиссии." />
        <Rule code="3.2.4" text="Цена донат-валюты без учёта бонусов/акций." sanction="Возврат пропорционально сумме бонусов." />
        <Rule code="3.3.1" text="Утрата покупателем аккаунта из-за восстановления доступа." sanction="Возврат до 100%." />
        <Rule code="3.3.2" text="Блокировка аккаунта из-за факта покупки/продажи." sanction="Возврат до 50%." />
        <Rule code="3.4.1" text="Существенное изменение характеристик аккаунта без согласования." sanction="Компенсация ущерба." />
        <Rule code="3.4.2" text="Услуга с отрицательным результатом." sanction="Возврат 100% + компенсация." />
        <Rule code="3.4.3" text="Блокировка аккаунта из-за некачественной услуги (боты, чит-ПО)." sanction="Возврат 100% + доп. компенсация." />
        <Rule code="3.4.4" text="Блокировка аккаунта из-за оказываемой услуги." sanction="Возврат до 50%." />
        <Rule code="3.4.5" text="Необоснованный отказ от дальнейшего выполнения услуги." sanction="Оплата 50% выполненной работы." />
        <Rule code="3.4.6" text="Задержка оговорённых сроков." sanction="Оплата снижается пропорционально задержке." />
      </Section>

      <p className="rounded-lg border border-border bg-card p-3 text-xs">
        Администрация оставляет за собой право связываться с продавцами под видом покупателей с
        целью выявления нарушений, а также смягчать или отменять наказания в индивидуальных случаях.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-foreground">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Rule({ code, text, sanction }: { code: string; text: string; sanction: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 p-3 text-xs">
      <div className="mb-1 font-mono text-[10px] font-semibold text-primary">{code}</div>
      <div className="text-foreground/90">{text}</div>
      <div className="mt-1 text-muted-foreground">
        <span className="font-medium text-foreground/70">Санкции:</span> {sanction}
      </div>
    </div>
  );
}
