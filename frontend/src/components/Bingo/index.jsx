import React, { useState, useEffect, useContext } from 'react';
import { BingoProvider } from './BingoProvider';
// import BingoInCMS from './BingoInCMS';
import {
	CreateBingo,
	DeleteBingo,
	GetBingo,
	listenBingoData,
	listenBingoNotifications,
	UpdateBingo,
	deleteValueBingo,
	importValuesBingo,
	updateValueBingo,
	createValueBingo,
	UpdateBingoDimension,
	generateBingoForExclusiveUsers,
	generateBingoForAllUsers,
} from './services';
import { CurrentEventContext } from './eventContext';
import { DispatchMessageService } from './MessageService';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { handleRequestError } from './utils';
import { Modal } from 'antd';
import { FormDataBingoInterface } from './interfaces/bingo';
import { background_color, background_image, banner, footer } from '../constants/constants';

const { confirm } = Modal;

const useBingo = () => {
	const [bingo, setBingo] = useState();
	const [loading, setLoading] = useState(false);
	const eventContext = useContext(CurrentEventContext);
	const [isVisibleModalTable, setIsVisibleModalTable] = useState(false);
	const [canEditBallotValue, setCanEditBallotValue] = useState({ isEdit: false, id: null });
	const [dataNotifications, setDataNotifications] = useState([]);
	const [dataFirebaseBingo, setDataFirebaseBingo] = useState({
		template: null,
		bingoData: [],
		currentValue: { value: '', type: '' },
		_id: '',
		demonstratedBallots: [],
		startGame: false,
	});

	let [listUsers, setListUsers] = useState([]);
	const [bingoPrint, setBingoPrint] = useState([
		{
			names: '',
			email: '',
			id: '',
			values: [
				{
					carton_value: {
						type: '',
						value: 'string',
					},
					ballot_value: {
						type: '',
						value: '',
					},
				},
			],
			code: '',
		},
	]);
	const initialFormDataBingo = {
		name: '',
		amount_of_bingo: 0,
		regulation: '',
		bingo_appearance: {
			background_color: background_color,
			background_image: background_image,
			banner: banner,
			footer: footer,
			dial_image: '',
		},
		bingo_values: [],
		dimensions: {
			format: '3x3',
			amount: 9,
			minimun_values: 18,
		},
	};

	const [formDataBingo, setFormDataBingo] = useState(initialFormDataBingo);
	const [valuesData, setValuesData] = useState({
		carton_value: {
			type: '',
			value: '',
		},
		ballot_value: {
			type: '',
			value: '',
		},
		id: '',
	});
	const { value } = eventContext;

	const getBingo = async () => {
		setLoading(true);
		const bingo = await GetBingo(value._id);
		if (bingo) {
			setBingo(bingo);
			setFormDataBingo(prev => ({
				...prev,
				name: bingo.name,
				amount_of_bingo: bingo.amount_of_bingo,
				regulation: bingo.regulation,
				bingo_appearance: bingo.bingo_appearance,
				bingo_values: bingo.bingo_values || [],
				dimensions: bingo.dimensions,
			}));
		}

		setLoading(false);
	};
	useEffect(() => {
		getBingo();
		return () => {
			setBingo(undefined);
			setFormDataBingo(prev => ({
				...prev,
				...initialFormDataBingo,
			}));
		};
	}, []);

	function getBingoListenerNotifications() {
		const unSuscribe = listenBingoNotifications(value._id, setDataNotifications);
		return unSuscribe;
	}

	const deleteEmptyData = (data) => {
		const newData = {};
		Object.keys(data).forEach(key => {
			if (data[key] !== undefined) {
				newData[key] = data[key];
			}
		});
		return newData;
	};

	const onSubmit = async (values) => {
		setLoading(true);
		if (bingo) {
			const data = {
				...deleteEmptyData(formDataBingo),
			};

			const response = await UpdateBingo(value._id, data, bingo._id);
			if (response) {
				setBingo(response);
				setFormDataBingo(prev => ({
					...prev,
					name: response.name,
					amount_of_bingo: response.amount_of_bingo,
					regulation: response.regulation,
					bingo_appearance: response.bingo_appearance,
					bingo_values: response.bingo_values || [],
					dimensions: response.dimensions,
				}));
			}
		} else {
			const createBingoBody = {
				...formDataBingo,
				name: values.name,
			};
			const response = await CreateBingo(value._id, createBingoBody);
			if (response) {
				setBingo(response);
				setFormDataBingo(prev => ({
					...prev,
					name: response.name,
					amount_of_bingo: response.amount_of_bingo,
					regulation: response.regulation,
					bingo_appearance: response.bingo_appearance,
					bingo_values: response.bingo_values || [],
				}));
			}
		}

		setLoading(false);
	};

	const changeBingoDimensions = async (dimensions) => {
		setLoading(true);
		const payload = {
			...formDataBingo,
			dimensions,
		};
		if (bingo) {
			const response = await UpdateBingoDimension(value._id, payload, bingo._id);
			if (response) {
				setBingo(response);
				setFormDataBingo({
					name: response.name,
					amount_of_bingo: response.amount_of_bingo,
					regulation: response.regulation,
					bingo_appearance: response.bingo_appearance,
					bingo_values: response.bingo_values || [],
					dimensions: response.dimensions,
				});
			}
		}
		setLoading(false);
	};

	const changeBingoDimensionsNew = async (dimensions) => {
		setFormDataBingo(prevState => ({
			...prevState,
			dimensions,
		}));
	};
	const deleteBingo = async () => {
		setLoading(true);
		if (bingo) {
			DispatchMessageService({
				type: 'loading',
				key: 'loading',
				msj: 'Por favor espere mientras se borra la información...',
				action: 'show',
			});
			confirm({
				title: `¿Está seguro de eliminar la información?`,
				icon: <ExclamationCircleOutlined />,
				content: 'Una vez eliminado, no lo podrá recuperar',
				okText: 'Borrar',
				okType: 'danger',
				cancelText: 'Cancelar',
				onOk() {
					const onHandlerRemove = async () => {
						try {
							await DeleteBingo(value._id, bingo._id);
							setBingo(undefined);

							DispatchMessageService({
								key: 'loading',
								action: 'destroy',
							});
							DispatchMessageService({
								type: 'success',
								msj: 'Se eliminó la información correctamente!',
								action: 'show',
							});
						} catch (e) {
							DispatchMessageService({
								key: 'loading',
								action: 'destroy',
							});
							DispatchMessageService({
								type: 'error',
								msj: handleRequestError(e).message,
								action: 'show',
							});
						}
					};

					onHandlerRemove();
				},
			});
		}

		setLoading(false);
	};

	const deleteBallotValue = (id) => {
		DispatchMessageService({
			type: 'loading',
			key: 'loading',
			msj: 'Por favor espere mientras se borra la información...',
			action: 'show',
		});
		confirm({
			title: `¿Está seguro de eliminar la información?`,
			icon: <ExclamationCircleOutlined />,
			content: 'Una vez eliminado, no lo podrá recuperar',
			okText: 'Borrar',
			okType: 'danger',
			cancelText: 'Cancelar',
			onOk() {
				const onHandlerRemove = async () => {
					const response = await deleteValueBingo(value._id, bingo._id, id);
					if (!response) {
						setLoading(false);
						return;
					}
					const newBingoValues = [...formDataBingo.bingo_values];
					const index = newBingoValues.findIndex((value) => value.id === id);
					newBingoValues.splice(index, 1);
					setFormDataBingo({
						...formDataBingo,
						bingo_values: newBingoValues,
					});
					DispatchMessageService({
						key: 'loading',
						action: 'destroy',
					});
					DispatchMessageService({
						type: 'success',
						msj: 'Se eliminó la información correctamente!',
						action: 'show',
					});
				};
				onHandlerRemove();
			},
		});
	};

	const thereIsBingo = (message) => {
		if (!bingo) setLoading(false);
		DispatchMessageService({
			type: 'error',
			msj: message,
			action: 'show',
		});
		return;
	};

	const actionEditBallotValue = (id) => {
		const newBingoValues = [...formDataBingo.bingo_values];
		const index = newBingoValues.findIndex((value) => value.id === id);
		setIsVisibleModalTable(!isVisibleModalTable);
		setValuesData({
			carton_value: newBingoValues[index].carton_value,
			ballot_value: newBingoValues[index].ballot_value,
			id: newBingoValues[index].id,
		});
		setCanEditBallotValue({
			isEdit: true,
			id,
		});
	};
	const editBallotValue = (
		id,
		values
	) => {
		setLoading(true);

		const response = updateValueBingo(value._id, bingo._id, values.id, values);
		if (!response) {
			setLoading(false);
			return;
		}
		const newBingoValues = [...formDataBingo.bingo_values];
		const index = newBingoValues.findIndex((value) => value.id === id);
		newBingoValues[index] = {
			...newBingoValues[index],
			carton_value: values.carton_value,
			ballot_value: values.ballot_value,
			id: values.id,
		};
		setFormDataBingo({
			...formDataBingo,
			bingo_values: newBingoValues,
		});
		setCanEditBallotValue({
			isEdit: false,
			id: null,
		});
		setValuesData({
			carton_value: {
				type: '',
				value: '',
			},
			ballot_value: {
				type: '',
				value: '',
			},
			id: '',
		});
		DispatchMessageService({
			key: 'loading',
			action: 'destroy',
		});
		DispatchMessageService({
			type: 'success',
			msj: 'Se editó la información correctamente!',
			action: 'show',
		});
		setLoading(false);
	};
	const onCancelValueTable = () => {
		setIsVisibleModalTable(!isVisibleModalTable);
		setValuesData({
			carton_value: {
				type: '',
				value: '',
			},
			ballot_value: {
				type: '',
				value: '',
			},
			id: '',
		});
		setCanEditBallotValue({
			isEdit: false,
			id: null,
		});
	};
	function getBingoListener() {
		const unSuscribe = listenBingoData(value._id, setDataFirebaseBingo);
		return unSuscribe;
	}

	const saveValueData = async () => {
		setLoading(true);

		const response = await createValueBingo(value._id, bingo._id, valuesData); //value es el id del evento
		if (!response) {
			setLoading(false);
			return;
		}
		setFormDataBingo({
			...formDataBingo,
			bingo_values: [...formDataBingo.bingo_values, { 
				...valuesData, 
				id: response.bingo_values[response.bingo_values.length - 1].id 
			}],
		});
		setValuesData({
			carton_value: {
				type: '',
				value: '',
			},
			ballot_value: {
				type: '',
				value: '',
			},
			id: '',
		});
		DispatchMessageService({
			key: 'loading',
			action: 'destroy',
		});
		DispatchMessageService({
			type: 'success',
			msj: 'Se editó la información correctamente!',
			action: 'show',
		});
		setLoading(false);
	};
	//List of users that have or haven't bingo
	// const onGetListUsersWithOrWithoutBingo = async (pageSize: number, page: number) => {
	// 	let list = [];
	// 	try {
	// 		//agregar paginacion
	// 		console.log("onGetListUsersWithOrWithoutBingo", { pageSize, page });
	// 		list = await getListUsersWithOrWithoutBingo(value._id, pageSize, page);
	// 		console.log("list", list);
	// 		//list = await getListUsersWithOrWithoutBingo(value._id, pagination.page, pagination.pageSize);
	// 		//list = await getListUsersWithOrWithoutBingo(value._id);
	// 		setPageSize(list.data.length);
	// 		setPage(list.current_page);
	// 		setLastPage(list.last_page_url);
	// 		setTotal(list.total);
	// 		console.log('pagination use bingo', { pageSize, page, lastPage, total });
	// 		const bingoPrintData = list.data.map((user: any) => {
	// 			return {
	// 				names: user?.properties?.names,
	// 				email: user?.properties?.email,
	// 				id: user?.bingo_card?._id,
	// 				values: user?.bingo_card?.values_bingo_card,
	// 				bingo: user?.bingo_card?.bingo,
	// 				code: user?.bingo_card?.code,
	// 			};
	// 		});
	// 		setBingoPrint(bingoPrintData);
	// 		setListUsers(list.data);
	// 		console.log('🚀 ~ file: useBingo.tsx:494 ~ bingoPrintData ~ bingoPrintData', bingoPrintData);
	// 	} catch (err) {
	// 		console.log(err, 'err');
	// 	}
	// };

	//Generate bingo for all users
	const onGenerateBingoForAllUsers = async (callback) => {
		Modal.confirm({
			title: `¿Está seguro de que desea generar de nuevo los cartones de bingo para todos los usuarios?`,
			icon: <ExclamationCircleOutlined />,
			content: 'Una vez generado los cartones de bingo debe esperar unos segundos para que la acción quede completa',
			okText: 'Confirmar',
			cancelText: 'Cancelar',
			onOk() {
				const onGenerate = async () => {
					DispatchMessageService({
						type: 'loading',
						key: 'loading',
						msj: 'Por favor espere mientras se generan los cartones de bingos para todos los usuarios...',
						action: 'show',
					});
					try {
						await generateBingoForAllUsers(value._id, bingo?._id);
						DispatchMessageService({
							key: 'loading',
							action: 'destroy',
						});
						DispatchMessageService({
							type: 'success',
							msj: '¡Se generaron correctamente los cartones de bingos para todos los usuarios!',
							action: 'show',
						});
						if(callback)callback(null)
					} catch (e) {
						DispatchMessageService({
							key: 'loading',
							action: 'destroy',
						});
						DispatchMessageService({
							type: 'error',
							msj: '¡Error generando los cartones de bingos para todos los usuarios!',
							action: 'show',
						});
						if(callback)callback(e)
					}
				};
				onGenerate();
			},
		});
	};

	//Generate bingo for exclusive users
	const onGenerateBingoForExclusiveUsers = async (callback) => {
		Modal.confirm({
			title: `¿Está seguro de que desea generar cartones de bingo para los usuarios restantes?`,
			icon: <ExclamationCircleOutlined />,
			content: 'Una vez generado los cartones de bingo debe esperar unos segundos para que la acción quede completa',
			okText: 'Confirmar',
			cancelText: 'Cancelar',
			onOk() {
				const onGenerate = async () => {
					try {
						DispatchMessageService({
							type: 'loading',
							key: 'loading',
							msj: 'Por favor espere mientras se generan los cartones de bingos para los usuarios restantes...',
							action: 'show',
						});
						await generateBingoForExclusiveUsers(value._id);
						DispatchMessageService({
							key: 'loading',
							action: 'destroy',
						});
						DispatchMessageService({
							type: 'success',
							msj: '¡Se generaron correctamente los cartones de bingos para los usuarios restantes!',
							action: 'show',
						});
						if(callback)callback(null)
					} catch (e) {
						DispatchMessageService({
							key: 'loading',
							action: 'destroy',
						});
						DispatchMessageService({
							type: 'error',
							msj: '¡Error generando los cartones de bingos para los usuarios restantes!',
							action: 'show',
						});
						if(callback)callback(e)
					}
				};
				onGenerate();
			},
		});
	};

	return {
		bingo,
		isLoading: loading,
		onSubmit,
		changeBingoDimensions,
		deleteBingo,
		formDataBingo,
		setFormDataBingo,
		valuesData,
		setValuesData,
		deleteBallotValue,
		actionEditBallotValue,
		editBallotValue,
		setIsVisibleModalTable,
		isVisibleModalTable: isVisibleModalTable,
		canEditBallotValue,
		setCanEditBallotValue,
		onCancelValueTable,
		getBingoListenerNotifications,
		dataNotifications,
		getBingoListener,
		dataFirebaseBingo,
		saveValueData,
		onGenerateBingoForAllUsers,
		onGenerateBingoForExclusiveUsers,
		changeBingoDimensionsNew,
		// onGetListUsersWithOrWithoutBingo,
		// listUsers,
		// pageSize,
		// page,
		// lastPage,
		// total,
		// setPageSize,
		// setPage,
		// setLastPage,
		// setTotal,
		// bingoPrint,
	};
};

const BingoContext = React.createContext();

const BingoProvider = ({ children }) => {
	const bingo = useBingo();

	return <BingoContext.Provider value={bingo}>{children}</BingoContext.Provider>;
};

const useBingoContext = () => {
	const context = React.useContext(BingoContext);
	if (!context) {
		throw new Error('useBingoContext must be used within a BingoProvider');
	}
	return context;
};

export { BingoProvider, useBingoContext };
