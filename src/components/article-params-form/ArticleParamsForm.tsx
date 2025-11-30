import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { useEffect, useRef, useState } from 'react';
import { Select } from 'src/ui/select';
import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
	OptionType,
} from 'src/constants/articleProps';
import styles from './ArticleParamsForm.module.scss';
import clsx from 'clsx';

type ArticleParamsFormProps = {
	onStateChange: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	onStateChange,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const formRef = useRef<HTMLDivElement>(null);
	const buttonContainerRef = useRef<HTMLDivElement>(null);

	// Временное состояние (изменения в форме)
	const [tempState, setTempState] =
		useState<ArticleStateType>(defaultArticleState);

	// Применённое состояние (передаётся наверх)
	const [appliedState, setAppliedState] =
		useState<ArticleStateType>(defaultArticleState);

	// Обработчик изменения опций в форме (обновляет только tempState)
	const handleOptionChange = (
		key: keyof ArticleStateType,
		selected: OptionType
	) => {
		setTempState((prev) => ({
			...prev,
			[key]: selected,
		}));
	};

	// Обработка нажатия "Применить"
	const handleApply = () => {
		setAppliedState(tempState); // Сохраняем текущие настройки как применённые
		onStateChange(appliedState); // Передаём в родительский компонент
	};

	// Обработка сброса формы
	const handleReset = () => {
		setTempState(defaultArticleState); // Сброс временных настроек
		setAppliedState(defaultArticleState); // Сброс применённых настроек
		onStateChange(defaultArticleState); // Уведомляем родительский компонент
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!isOpen) return;

			const path = event.composedPath();

			if (
				buttonContainerRef.current &&
				buttonContainerRef.current.contains(event.target as Node)
			) {
				return;
			}

			// Если формы нет в пути события — закрываем
			if (formRef.current && !path.includes(formRef.current)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [isOpen]);

	return (
		<>
			<div ref={buttonContainerRef}>
				<ArrowButton
					isOpen={isOpen}
					onClick={() => setIsOpen((prev) => !prev)}
				/>
			</div>
			<aside
				ref={formRef}
				className={clsx(styles.container, isOpen && styles.container_open)}>
				<form
					className={styles.form}
					onSubmit={(e) => {
						e.preventDefault();
						handleApply();
					}}>
					<Select
						title='Шрифт'
						selected={tempState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(selected) =>
							handleOptionChange('fontFamilyOption', selected)
						}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='radio'
						selected={tempState.fontSizeOption}
						options={fontSizeOptions}
						onChange={(selected) =>
							handleOptionChange('fontSizeOption', selected)
						}
					/>
					<Select
						title='Цвет шрифта'
						selected={tempState.fontColor}
						options={fontColors}
						onChange={(selected) => handleOptionChange('fontColor', selected)}
					/>
					<Select
						title='Цвет фона'
						selected={tempState.backgroundColor}
						options={backgroundColors}
						onChange={(selected) =>
							handleOptionChange('backgroundColor', selected)
						}
					/>
					<Select
						title='Ширина контента'
						selected={tempState.contentWidth}
						options={contentWidthArr}
						onChange={(selected) =>
							handleOptionChange('contentWidth', selected)
						}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='clear' onClick={handleReset} />
						<Button title='Применить' type='apply' onClick={handleApply} />
					</div>
				</form>
			</aside>
		</>
	);
};
