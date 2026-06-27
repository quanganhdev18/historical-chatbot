export const STORY_BATRIEU = {
  // HỒI 1: ĐÊM TRẮNG NGÀN NƯA
  start: {
    speaker: "Dòng Lịch Sử",
    text: "Năm 248. Sương đêm phủ kín Ngàn Nưa lạnh buốt. Trong trướng, nến leo lét rọi bóng một người con gái mặc giáp vàng đang trầm ngâm trước bản đồ da cừu. Bạn - phó tướng thân tín nhất - khẽ bước vào.",
    choices: [
      { label: "Tiến lại gần và lên tiếng gọi", nextId: "act1_approach" }
    ]
  },
  act1_approach: {
    speaker: "Bà Triệu",
    text: "(Thở dài, không quay lưng lại) Ngươi vẫn chưa ngủ sao? Lại đây... nhìn vào những điểm đánh dấu này đi. Mỗi đốm lửa ngoài kia không chỉ là một binh sĩ, mà là một sinh mạng, một mảnh hồn của đất Cửu Chân đang ký thác vào tay Ta. Kể từ khi anh trai Quốc Đạt mất đi... áp lực này, thật sự quá lớn.",
    choices: [
      { label: "Bà mang vác cả giang sơn trên đôi vai nhỏ bé này, hẳn là rất đơn độc?", nextId: "act1_empathy" },
      { label: "Máu của chủ tướng Quốc Đạt nợ phải trả bằng máu! Xin đừng ủy mị!", nextId: "act1_vengeance" }
    ]
  },
  act1_empathy: {
    speaker: "Bà Triệu",
    text: "(Ánh mắt dịu lại, rưng rưng) Người đời gọi Ta là Nhụy Kiều Tướng Quân, tôn Ta như thần thánh. Nhưng cởi bỏ áo giáp, Ta cũng chỉ là một người con gái 23 tuổi... Đôi lúc, nhìn những binh lính trẻ tuổi bằng tuổi đệ đệ mình phải ngã xuống, lòng Ta đau như cắt. Ta tự hỏi... cái giá của tự do phải trả bằng bao nhiêu sinh mạng mới là đủ?",
    choices: [
      { label: "Bá tánh tự nguyện hi sinh vì đại nghĩa. Trời sáng rồi, ta phải chuẩn bị duyệt binh.", nextId: "act2_start_compassion" }
    ]
  },
  act1_vengeance: {
    speaker: "Bà Triệu",
    text: "(Bóp nát chén rượu, ánh mắt lóe lên sự phẫn nộ) Ngươi nói đúng! Nước mắt không thể gột sạch ách đô hộ của loài chó họ Tôn. Kẻ thất phu Lục Dận đã chém giết đồng bào ta, Ta sẽ bắt hắn phải đền mạng bằng cả cửu tộc! Từ nay, không có sự xót thương nào ở Ngàn Nưa này nữa!",
    choices: [
      { label: "Nguyện theo gót gươm của Bà! Điểm binh!", nextId: "act2_start_ruthless" }
    ]
  },

  // HỒI 2: GIÓ TANH MƯA MÁU
  act2_start_compassion: {
    speaker: "Dòng Lịch Sử",
    text: "Sáng hôm sau, quân lệnh ban ra. Tuy nhiên, nội bộ binh lính bắt đầu lung lay do Lục Dận tung tin đồn và mua chuộc. Đội canh gác vừa bắt được một lính tráng định đào ngũ trong đêm.",
    choices: [
      { label: "Áp giải hắn lên trướng", nextId: "act2_deserter_compassion" }
    ]
  },
  act2_deserter_compassion: {
    speaker: "Lính Đào Ngũ",
    text: "(Dập đầu khóc lóc) Xin Nữ tướng tha mạng! Ở nhà con còn mẹ già mù lòa không ai chăm sóc. Con sợ chết... Con không muốn đánh nữa!",
    choices: [
      { label: "[Tư vấn] Quân pháp bất vị thân! Xin Bà cho chém đầu lập uy!", nextId: "act2_execution" },
      { label: "[Tư vấn] Lấy đức phục nhân. Xin Bà đánh 50 roi răn đe rồi cho hắn về quê.", nextId: "act2_forgive" }
    ]
  },
  act2_start_ruthless: {
    speaker: "Dòng Lịch Sử",
    text: "Với sát khí bừng bừng, Bà Triệu thiết quân luật khắt khe. Sáng hôm đó, một tên lính đào ngũ bị bắt lại. Không cần xét hỏi lý do, Bà Triệu rút gươm đặt lên cổ hắn.",
    choices: [
      { label: "Chờ xem Nữ tướng quyết định", nextId: "act2_deserter_ruthless" }
    ]
  },
  act2_deserter_ruthless: {
    speaker: "Bà Triệu",
    text: "Kẻ hèn nhát bỏ trốn khi lâm trận chính là mầm mống phản loạn! Chết ở chiến trường là vinh quang, trốn chạy là ô nhục. Phó tướng, ngươi nghĩ Ta nên xử lý tên cặn bã này thế nào?",
    choices: [
      { label: "Chém bêu đầu thị chúng! Không có ngoại lệ!", nextId: "act2_execution" },
      { label: "Đuổi hắn đi cho khuất mắt, giết kẻ hèn làm bẩn gươm báu.", nextId: "act2_exile" }
    ]
  },
  act2_execution: {
    speaker: "Bà Triệu",
    text: "(Hạ kiếm, máu tuôn xối xả) Truyền lệnh toàn quân: Kẻ nào lùi một bước, nhận một đao! Kẻ nào bỏ trốn, chu di tam tộc!",
    choices: [
      { label: "Chứng kiến đội quân trở nên tĩnh lặng và đáng sợ", nextId: "act3_start_ruthless" }
    ]
  },
  act2_forgive: {
    speaker: "Bà Triệu",
    text: "Giao Châu ta đã đổ quá nhiều máu. Trượng phạt 50 roi, cấp cho hắn chút lộ phí rồi đuổi về chăm mẹ già. Kẻ nào tâm không tĩnh, Ta không cần ép buộc lưu lại.",
    choices: [
      { label: "Chứng kiến quân lính cảm động rơi lệ, sĩ khí dâng cao", nextId: "act3_start_compassion" }
    ]
  },
  act2_exile: {
    speaker: "Bà Triệu",
    text: "Lột áo giáp của hắn! Đánh đuổi ra khỏi doanh trại. Quân của Bà Triệu không chứa chấp loài nhát gan.",
    choices: [
      { label: "Nhìn bóng hắn lủi thủi trong đêm (Hắn biết đường đi lối lại)", nextId: "act3_start_weak" }
    ]
  },

  // HỒI 3: HUYẾT CHIẾN BỒ ĐIỀN
  act3_start_compassion: {
    speaker: "Dòng Lịch Sử",
    text: "Ba tháng sau tại phòng tuyến Bồ Điền. Quân của Lục Dận bao vây bốn phía. Nhờ ân đức của Bà Triệu, quân sĩ thề tử chiến không lùi. Tuy nhiên, Lục Dận đã giở trò hèn hạ: Lùa hàng ngàn bá tánh tay không tấc sắt đi đầu làm bia đỡ đạn.",
    choices: [
      { label: "Tình thế ngàn cân treo sợi tóc", nextId: "act3_compassion_decision" }
    ]
  },
  act3_compassion_decision: {
    speaker: "Bà Triệu",
    text: "(Cắn nát môi rớm máu) Khốn kiếp! Bắn tên thì chết dân, không bắn thì giặc tràn qua thành! Phó tướng, theo ngươi ta phải làm sao?!",
    choices: [
      { label: "Mở cổng thành! Đánh xáp lá cà mở đường máu cứu dân!", nextId: "ending_historical" },
      { label: "Phải tử thủ! Mặc kệ dân chúng đi, nếu mất Bồ Điền là mất tất cả!", nextId: "ending_bad_coward" }
    ]
  },
  act3_start_ruthless: {
    speaker: "Dòng Lịch Sử",
    text: "Đội quân khát máu của Bà Triệu trở thành nỗi khiếp sợ của Đông Ngô. Tại chiến trường Bồ Điền, thám báo phát hiện quân Ngô giấu toàn bộ kho lương trong một khu rừng kín. Tuy nhiên, khu rừng đó đang có hàng trăm trẻ em và phụ nữ ẩn náu.",
    choices: [
      { label: "Báo cáo tình hình với chủ tướng", nextId: "act3_ruthless_decision" }
    ]
  },
  act3_ruthless_decision: {
    speaker: "Bà Triệu",
    text: "(Cười lạnh lẽo) Lục Dận, ngươi tưởng giấu trong dân là Ta không dám động thủ? Phó tướng, truyền lệnh dùng hỏa công! Thiêu rụi toàn bộ khu rừng đó cho Ta!",
    choices: [
      { label: "Phóng hỏa! Giết nhầm còn hơn bỏ sót!", nextId: "ending_dark_victory" },
      { label: "Dừng tay! Ta dùng trận đồ 'Hỏa Ngưu' tập kích mạn sườn, tránh làm hại dân!", nextId: "ending_secret_victory" }
    ]
  },
  act3_start_weak: {
    speaker: "Dòng Lịch Sử",
    text: "Tên lính đào ngũ bị đuổi đi đã ôm hận và bán đứng bản đồ phòng tuyến cho Lục Dận. Ngay đêm đó, 8000 quân Đông Ngô luồn qua đường mòn đánh úp Sở Chỉ Huy Bồ Điền.",
    choices: [
      { label: "Báo động toàn quân!", nextId: "act3_weak_decision" }
    ]
  },
  act3_weak_decision: {
    speaker: "Bà Triệu",
    text: "Ta đã quá tin vào nhân tâm! Đại quân sụp đổ rồi... Bốn phía đều là giặc Ngô, chúng ta không còn đường lui nữa.",
    choices: [
      { label: "Liều mạng mở đường máu cho Bà Triệu thoát!", nextId: "ending_sacrifice_failed" },
      { label: "Rút gươm tự vẫn để bảo toàn danh tiết!", nextId: "ending_bad_coward" }
    ]
  },

  // KẾT CỤC
  ending_historical: {
    speaker: "Dòng Lịch Sử",
    text: "Cổng thành mở tung. Bà Triệu mặc giáp vàng, cưỡi voi trắng xông thẳng vào hàng ngũ 8000 quân Ngô để dân làng có khe hở chạy trốn. Giữa vòng vây trùng điệp, Bà vung gươm chém gục hàng trăm tên giặc cho đến khi kiệt sức...",
    ending: {
      type: "historical",
      title: "TRUE ENDING: BẢN ANH HÙNG CA",
      desc: "Năm 248, Bà Triệu tuẫn tiết tại núi Tùng để giữ tròn khí tiết. Bạn gục ngã bên cạnh chủ tướng. Trận chiến thất bại về quân sự, nhưng tiếng vang của tình yêu bá tánh và sự kiêu hãnh bất khuất đã trở thành ngọn đuốc thắp sáng đêm trường Bắc Thuộc."
    }
  },
  ending_dark_victory: {
    speaker: "Dòng Lịch Sử",
    text: "Khu rừng rực cháy suốt 3 ngày đêm. Lục Dận mất toàn bộ lương thảo, buộc phải rút quân và bị nghĩa quân truy sát chém đầu. Bà Triệu giành độc lập cho Giao Châu.",
    ending: {
      type: "victory",
      title: "DARK ENDING: VƯƠNG TRIỀU MÁU",
      desc: "Bạn và Bà Triệu lên ngôi, nhưng đôi bàn tay vấy máu hàng ngàn người dân vô tội. Nhân dân gọi Bà là Bạo Chúa thay vì Mẫu Nghi. Vương triều được xây bằng sự tàn nhẫn, lạnh lẽo và cô độc."
    }
  },
  ending_secret_victory: {
    speaker: "Dòng Lịch Sử",
    text: "Bằng chiến thuật 'Hỏa Ngưu Trận' (cột giẻ tẩm dầu vào sừng trâu), nghĩa quân xuyên thủng phòng tuyến giặc mà không đụng đến khu rừng. Lục Dận hoảng loạn tử trận.",
    ending: {
      type: "victory",
      title: "SECRET ENDING: QUANG PHỤC CỬU CHÂN",
      desc: "Trí dũng song toàn! Bạn đã giúp Bà Triệu giành chiến thắng vĩ đại nhất lịch sử mà vẫn giữ trọn được lòng nhân. Một vương triều độc lập rực rỡ mở ra, bá tánh Giao Châu hưởng thái bình thịnh trị."
    }
  },
  ending_bad_coward: {
    speaker: "Dòng Lịch Sử",
    text: "Sự bạc nhược và ích kỷ đã phá hủy lòng tin của nghĩa quân. Quân lính tháo chạy toán loạn, bỏ mặc Sở chỉ huy.",
    ending: {
      type: "bad",
      title: "BAD ENDING: VẾT NHƠ NGÀN NĂM",
      desc: "Sự sợ hãi đã dẫn đến thất bại thảm hại nhất. Bạn và Bà Triệu bị giặc bắt và chịu cảnh nhục nhã. Lịch sử mãi mãi lãng quên những kẻ hèn nhát."
    }
  },
  ending_sacrifice_failed: {
    speaker: "Dòng Lịch Sử",
    text: "Bạn một mình cầm giáo lao vào hàng ngàn mũi tên của quân Ngô để câu giờ. Thân thể bạn bị bắn nát như tổ ong...",
    ending: {
      type: "bad",
      title: "NORMAL ENDING: LÒNG TRUNG THÀNH",
      desc: "Bạn hi sinh anh dũng nhưng không thể vãn hồi cục diện. Cuộc khởi nghĩa bị dập tắt, nhưng lòng trung thành tuyệt đối của bạn dành cho Bà Triệu đã khiến ngay cả giặc Ngô cũng phải ngả mũ kính phục."
    }
  }
};

export const STORY_LELOI = {
  // HỒI 1: NẾM MẬT NẰM GAI
  start: {
    speaker: "Dòng Lịch Sử",
    text: "Năm 1418. Cuộc khởi nghĩa Lam Sơn bùng nổ nhưng liên tục bị quân Minh đàn áp. Nghĩa quân phải rút lên núi Chí Linh lần thứ 3. Lương thảo cạn kiệt, binh sĩ kiệt sức. Bạn - cận vệ thân tín của Bình Định Vương Lê Lợi - bước vào lều chỉ huy.",
    choices: [
      { label: "Hành lễ và báo cáo tình hình tuyệt vọng", nextId: "act1_report" }
    ]
  },
  act1_report: {
    speaker: "Lê Lợi",
    text: "(Ánh mắt trầm ngâm nhìn về phương Bắc) Đã 3 lần nếm mật nằm gai ở Chí Linh này... Quân Minh vây khốn bốn bề. Tướng sĩ chỉ còn ăn cỏ rễ măng rừng mà sống. Chẳng lẽ trời xanh thực sự muốn diệt Lam Sơn ta sao?",
    choices: [
      { label: "Chúng ta liều mạng phá vây một trận tử chiến đi Chúa công!", nextId: "act1_reckless" },
      { label: "Xin Chúa công nén bi thương. Quân tử báo thù mười năm chưa muộn.", nextId: "act1_patience" }
    ]
  },
  act1_reckless: {
    speaker: "Lê Lợi",
    text: "(Gõ mạnh tay xuống bàn) Kẻ thất phu! Quân ta chưa đầy ngàn người, đánh vỗ mặt với hàng vạn quân Minh chẳng khác nào lấy trứng chọi đá. Nếu ta chết, ai sẽ cứu bá tánh khỏi lầm than?!",
    choices: [
      { label: "Cúi đầu nhận lỗi và chờ chỉ thị", nextId: "act1_lelai_offer" }
    ]
  },
  act1_patience: {
    speaker: "Lê Lợi",
    text: "(Gật đầu) Đúng vậy. Đại nghĩa cốt ở yên dân. Ta không tiếc mạng mình, nhưng nếu ta gục ngã, hi vọng của An Nam cũng tắt. Chúng ta phải tìm đường sống trong cõi chết.",
    choices: [
      { label: "Bỗng nhiên, Lê Lai bước vào trướng...", nextId: "act1_lelai_offer" }
    ]
  },
  act1_lelai_offer: {
    speaker: "Lê Lai",
    text: "Chúa công! Tình thế nay đã như chỉ mành treo chuông. Thần khuôn mặt có vài phần giống ngài. Xin hãy cho thần mặc áo hoàng bào, cưỡi voi ra trận để giả danh Chúa công. Quân Minh tất sẽ xúm lại đánh. Thần nguyện liều thân để Chúa công thoát vòng vây!",
    choices: [
      { label: "[Quyết Định] Đồng ý để Lê Lai đi. Lấy đại cục làm trọng!", nextId: "act2_start_sacrifice" },
      { label: "[Quyết Định] Tuyệt đối không! Thà chết cùng nhau, không bỏ huynh đệ!", nextId: "act2_start_foolish" }
    ]
  },

  // HỒI 2: ĐẠI NGHĨA THẮNG HUNG TÀN
  act2_start_sacrifice: {
    speaker: "Dòng Lịch Sử",
    text: "Lê Lai khoác hoàng bào tử trận. Quân Minh tưởng Lê Lợi đã chết nên rút quân. Nghĩa quân Lam Sơn được cứu, thế lực ngày một lớn mạnh. Mười năm sau, quân ta đại phá giặc Minh, bắt sống hàng vạn tù binh tại Đông Quan.",
    choices: [
      { label: "Cùng Nguyễn Trãi diện kiến Lê Lợi", nextId: "act2_prisoner_choice" }
    ]
  },
  act2_prisoner_choice: {
    speaker: "Lê Lợi",
    text: "Vương Thông đã dâng bảng đầu hàng. Giờ đây trong tay ta là hàng vạn sinh mạng quân Minh tù binh. Máu của bá tánh ta đã chảy thành sông dưới gót giày của chúng. Ngươi nghĩ ta nên xử lý đám tù binh này thế nào?",
    choices: [
      { label: "Nợ máu trả bằng máu! Chém đầu toàn bộ để tế vong linh người đã khuất!", nextId: "act3_start_dark" },
      { label: "Mở đường hiếu sinh. Cấp thuyền và lương thảo cho chúng về nước.", nextId: "act3_start_true" }
    ]
  },
  act2_start_foolish: {
    speaker: "Dòng Lịch Sử",
    text: "Bạn và Lê Lợi quyết định tử chiến, từ chối sự hi sinh của Lê Lai. Dù chiến đấu vô cùng anh dũng, nhưng lực lượng quá chênh lệch. Toàn bộ nghĩa quân bị tiêu diệt trên núi Chí Linh.",
    choices: [
      { label: "Kết cục tất yếu...", nextId: "ending_bad_stubborn" }
    ]
  },

  // HỒI 3: HUYẾT CHIẾN HOẶC HÒA BÌNH
  act3_start_dark: {
    speaker: "Dòng Lịch Sử",
    text: "Lê Lợi ra lệnh tàn sát toàn bộ hàng vạn tù binh. Máu chảy đỏ sông Nhị Hà. Hành động này khiến triều đình nhà Minh thịnh nộ, lập tức cử 20 vạn đại quân sang đánh trả.",
    choices: [
      { label: "Quân ta sức tàn lực kiệt phải đón nhận đại quân mới", nextId: "ending_dark_revenge" }
    ]
  },
  act3_start_true: {
    speaker: "Dòng Lịch Sử",
    text: "Lê Lợi chọn tha chết cho tù binh. Cấp cho chúng hàng ngàn chiếc thuyền và lương thảo. Hành động nhân nghĩa này làm chấn động toàn bộ binh lính nhà Minh, khiến Vương Thông tâm phục khẩu phục mà rút lui hoàn toàn.",
    choices: [
      { label: "Tham gia lễ vinh danh tại hồ Tả Vọng", nextId: "ending_true_legend" }
    ]
  },

  // ENDINGS
  ending_bad_stubborn: {
    speaker: "Dòng Lịch Sử",
    text: "Sự cứng nhắc của bạn đã khiến hi vọng cuối cùng của An Nam bị dập tắt.",
    ending: {
      type: "bad",
      title: "BAD ENDING: NGỌN LỬA CHẾT YỂU",
      desc: "Cuộc khởi nghĩa Lam Sơn kết thúc tại núi Chí Linh. Không có huyền thoại nào được sinh ra, đất nước chìm trong ngàn năm tăm tối."
    }
  },
  ending_dark_revenge: {
    speaker: "Dòng Lịch Sử",
    text: "Dù ban đầu chiến thắng, sự tàn nhẫn đã dẫn đến chiến tranh liên miên không dứt.",
    ending: {
      type: "bad",
      title: "DARK ENDING: HẬN THÙ MÙ QUÁNG",
      desc: "Bạn đã trả thù được, nhưng lại kéo cả dân tộc vào một cuộc chiến hủy diệt với nhà Minh. Lê Lợi trở thành một bạo chúa khát máu thay vì bậc minh quân."
    }
  },
  ending_true_legend: {
    speaker: "Dòng Lịch Sử",
    text: "Giặc tan. Bình Ngô Đại Cáo được tuyên đọc, khẳng định nền độc lập trường tồn của non sông. Lê Lợi lên ngôi Hoàng đế, mở ra triều Hậu Lê phát triển rực rỡ nhất lịch sử. Tại hồ Tả Vọng, một con rùa vàng nổi lên, nhà vua trao trả thanh gươm Thuận Thiên...",
    ending: {
      type: "victory",
      title: "TRUE ENDING: TRUYỀN THUYẾT HỒ GƯƠM",
      desc: "Bằng trí tuệ, lòng nhân đạo và đại nghĩa, bạn đã phò tá Bình Định Vương thu non sông về một mối. Tên tuổi của bạn được lưu truyền muôn đời như một công thần khai quốc vĩ đại."
    }
  }
};
