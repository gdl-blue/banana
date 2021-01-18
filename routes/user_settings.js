wiki.get('/Customize', async function memberSettings(req, res) {
	const defskin = config.getString('default_skin', hostconfig['skin']);
	const defskil = config.getString('default_skin_legacy', hostconfig['skin']);
	const myskin  = getCookie(req, res, 'ddochi', compatMode(req) ? defskil : defskin);
	const mycolor = getCookie(req, res, 'timecosmos', await getScheme(req));
	
	var dsop = `
		<option value="${defskin}" ${'x' == defskin ? 'selected' : ''}>${lang(req, '기본값', 'Default')} (${defskin})</option>
	`;
	
	var dsra = `
		<label><input type=radio name=ddochi value="${defskin}" ${'x' == defskin ? 'checked' : ''} /> ${lang(req, '기본값', 'Default')} (${skindisp[defskin] || defskin})</label><br />
	`;
	
	for(skin of getSkins()) {
		dsop += `<option value="${skin}" ${myskin == skin ? 'selected' : ''}>${skindisp[skin] || skin}</option>`;
		dsra += `<label><input type=radio name=ddochi value="${skin}" ${myskin == skin ? 'checked' : ''} /> ${skindisp[skin] || skin}</label><br />`;
	}
	
	var clrs = '';
	
	var bgclrcss;
	var spin;
	
	var content = `
		${
			lang(req, 1, 2) != 1 ? (
				alertBalloon('[Warning]', 'Cookies are used to save your settings.', 'warning')
			) : ''
		}
	
		<form method=post class=xxxmc-fallback>
			<div class=form-group id=actionGroup>
				<h2 class=wiki-heading>동작</h2>
				<div class=wiki-heading-content>
					<div class=form-group>
						<h4 class=wiki-heading>스크립트</h4>
						<div class=wiki-heading-content>
							<label><input type=checkbox id=noscriptDiscussInput name=no-discuss-script ${req.cookies['no-discuss-script'] ? 'checked' : ''} /> 토론 페이지에서 스크립트 의존 안함</label><br />
							<label><input type=checkbox id=noscriptUploadInput name=no-upload-script ${req.cookies['no-upload-script'] ? 'checked' : ''} /> 파일 업로드 페이지에서 스크립트 의존 안함</label><br />
						</div>
					</div>
					
					<div class=form-group>
						<h4 class=wiki-heading>토론 기능</h4>
						<div class=wiki-heading-content>
							<label><input type=checkbox id=alwaysHideResInput name=always-hide-hidden-res ${req.cookies['always-hide-hidden-res'] ? 'checked' : ''} /> 항상 숨겨진 댓글 보이지 않기 (버그 존재)</label><br />
						</div>
					</div>
				</div>
			</div>
			
			<div class=form-group id=displayGroup>
				<h2 class=wiki-heading>디스플레이</h2>
				<div class=wiki-heading-content>
					<div class=form-group fgv>
						<h4 class=wiki-heading>테마 ${islogin(req) ? '<sub>(비로그인 시에만 적용됩니다. 내 정보 페이지에서 바꾸십시오.)</sub>' : ''}</h4>
						<div class=wiki-heading-content>
							<div class=form-group>
								<label>스킨: </label><br />
								<div class=multicol>
									${dsra}
								</div>
								
								<!--
									<select class=form-control name=ddochi id=skinSelect>
										${dsop}
									</select>
								-->
							</div>
						</div>
					</div>
					
					<div class=form-group id=accessibilityGroup>
						<h4 class=wiki-heading>접근성</h4>
						<div class=wiki-heading-content>
							<div class=form-group>
								<label><input type=checkbox id=hideStrikethroughInput name=hide-strikethrough ${req.cookies['hide-strikethrough'] ? 'checked' : ''} /> 취소선 숨기기</label><br />
								<label><input type=checkbox id=unboldInput name=unbold ${req.cookies['unbold'] ? 'checked' : ''} /> 굵은 글씨 속성 해제</label><br />
								<label><input type=checkbox id=unitalicInput name=unitalic ${req.cookies['unitalic'] ? 'checked' : ''} /> 기울임 글씨 속성 해제</label><br />
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class=form-group id=debugGroup>
				<h2 class=wiki-heading>개발 및 디버깅</h2>
				<div class=wiki-heading-content>
					<div class=form-group>
						<h4 class=wiki-heading>통신</h4>
						<div class=wiki-heading-content>
							<div class=form-group>
								<label><input type=checkbox name=space-bonefish ${req.cookies['space-bonefish'] ? 'checked' : ''} /> 오류에 관계없이 200 코드 반환</label><br>
							</div>
						</div>
					</div>
					
					<div class=form-group>
						<h4 class=wiki-heading>스크립트</h4>
						<div class=wiki-heading-content>
							<div class=form-group>
								<label><input type=checkbox name=bioking ${req.cookies['bioking'] ? 'checked' : ''} /> jQuery를 불러올 때 압축되지 않은 버전 불러오기</label><br>
							</div>
						</div>
					</div>
				</div>
			</div>
					
			<div class=btns>
				<button type=submit class="btn btn-primary" style="width: 100px;">적용!</button>
			</div>
		</form>
		
		<!------------------------------------------------------------>
		
<!--
		<div class=mc-transition-container style="display: none;">
			<div class=mc-transition id=main-menu main>
				<div class=mc-inner-wrapper>
					<div class=mc-inner-content>
						<table class=settings-menu>
							<tr>
								<td onclick="transition($('#main-menu'), $('#actions-menu'));">
									<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAwCAYAAAC4wJK5AAAAAXNSR0ICQMB9xQAAAAlwSFlzAAAXEgAAFxIBZ5/SUgAAABl0RVh0U29mdHdhcmUATWljcm9zb2Z0IE9mZmljZX/tNXEAABH2SURBVGje1VppcFvndVXc1KmTJjOpO52p47odp3GbmXTGcaftdGK3mcZu6rR27HiJbUWR40S2m7G1WJJlSZRELRRJ7RRFSrRFkQQpLuBOcAcXEAQXgSBILA8giH0lAIJYCYIk8HB6P1B2nDiy6JFspz/uQKTew/vOd+8995zvccPhw4c3fFpRoEjcXaTAg636lSf2Hyv6m0/rObf9C0sMK09dnkp15g+HZCel4aWq6SUobRG8dvBcYNPOQ9/+uHvFeSV/8gcBonU55W4JA1e1QIMmjslZD6ZmHNiWewVPbt5efKP7RF68JPXHjdVi1S8+VxAc8PU2nve0LxEALoFhzo0JvQNq0xyyi4V47KWtvQD+6Hfve8+K719y82ltHOAiQJvK1Vgqlj30uYDoAv6lj1YpnAfazcsY1zkpHNCY53Chuhs/2rzbazAYvvThe/5rHPcfNPMWgRPoU/swZg7BlgIkxsByl1S57/MA8QLbauEcgTAtY0znyoBgmRD2yvGfP98Rzj526v73r39OgW/ut/DmMi+VH5dE16QNo3oPDK4gvMEYapq7cOpcyQn6yjtuC4igInhXnkBx78dd08Pzx4foibUuoMOUyIAYIxBTs26Ix7V4/s3DeHHTpofZtTvN+NtsM2+tIABlXBoNEy7qHzdmnAG45iOQyK7h7UO52JOdFzKbzV+9ZRDmIL7SOp8aGvEsR6r6NXs2bNjwe3emK52uFxOIOgfQyUDo3RROKKmxBzVubDpehxezKqrLNbGtWTrexDJQrgPqVWHI9S5w9gCMrgCsLi/OFV/G7oN5OHGhJOeWy4nW9NVL7vRA7QJgDKWhX6TGm3IPlTRJPtJ4Ip6f6UoTCPt1EDNujBOIPs0cmtVh1E2FcEXmRr0NKLZSBnRpVE7HMWGah8YWAGfzw01ZEA/K8Na+Y8g6cjLAcZ67bxlEgTXdcSlEdc4to2fSjhFjALYkILNHlmulhn1CykqeEo9nj6dkRSY+KfTQzlImusxrmejR+glACK2qINq1IXRxQTRziyifAQSaVQzPBqG2EgirHyb3Asx2D04WXKIyykeZoPbQLTV2HnDXISufW0wpr7Ywzo+hfcIGsdqLIf08dAspGCkrhRORqZxJ2lW6plzFo1K1ijoDjy7jEnq5ebRqw2jThCDSEAj1Ajo0AfpdBFUEom92ESrLfCb0dj8882F09g5i+74jyDlRSLnHn90SiK4EHlTQt4wuEwBTEi3GJHoNMfSq5zLRr/FizBLBVSqNKzQgBOoVXJmIopEy1m1YwpA5Dql5kSIOiXkJ/QyUIYpuHQHiaLGGBBTmACbN85g2+2DyhKG10DzJO0cNnYcqYdPO2zIn5Dx/ijYYjU4e7axEqNZ7GBACIKY6Zzsr0KZRRWVRp46jZ2YRo5ZFyO0s4rhGMW5bwqh9GcP2JKRUh4PWJPrNK5AYQpDqvJDo5jCkdUJh8kMfSGL/+Rps25019qGe/GKTKnn/CXny+xXK+JGGQd1liUzx0LpBEO9/aYLndaQgIKJa77gOpJfKoE/rRYs2ihqOSod2ftwSxaSNRQwKAqFwLGLCQSDsCYw6VjIghmiKDdjSGKDv6LPQv/ULGNTOQaJxYUjjgM4dxagpjBcOlvadkAT3nL22IjgzGraclkXi76p5KLxpNEvV2PRWjlyhUHxt3Y09SFNYzfO8lKSEyHk9G7Y1ICLdIgapMSatQRJ5oYzQm7JHMe2IQeWMYYqAaGh6KwNEBG5g8H0A10NsSWKA80Oi9RAIJ66RROmbjSFb7Me58SXUmoFKLkU6bAV9dB1ncqNtSIkfv3YAr2zd/91PNCf6aIjR96GHWq2NHt5K9CiiX4yYI1BaFzBFobIHoXGEoHdFYPYtwuRfwmwwBftyasi6DIl1mfdPBAk8bUSPfS26aTPEpiVIuDlItS7qMw8qp6Ko1SZQo6KJrVokQlmEWB8kgHZMzjghmzZh4858vLzjwOufCAQTbbVxnhOSQKuixdcYgQFTHEoLAxCAmjhe7wzC6ovB4Y/RrrpwUWzEgXY7flVnSz4jDHqy5EurHUQSQyu0eGK8DvtaVrsIyMDMAvWFB03qCGqotxpp4R36GGU5ignKrsoexhR7lnEO00Y3KeLL+N6Pf3n4E4EQJPHNgkV+oYLkRLWJdJFxlVhlLQNsSM04FuAOLMJgnUNp8yC2FbbgteI+bCnqj2x5d6TjmULFgUcKDHufKjPV1s+nFqZpVzqYSKSsiFiPEXN1cwto08Uz5TRKrKe00+IdEajpU0sgZtwROBfitFFRZF9qwqMvvdHziUCcXeIFNTTgqmbTqJ1JYdTMdob4nbKgd5DWCcTAGaw4XVyGt3KKcfBCDd5tGjjj8XB/+RGy8OPvpnjeryCl2kx90kaZ6DDzkBojtOvRTE9NMQAUGlq83hmGjbJr90cxpLLibN0Q9pT04FdZ5+eCCsVdNwQhMOOeUnnk8UJ58tcFY9GG0x5+tZrYSaBPoWOWnJrZnwGhJZlg9YZgsrlRcPEK3jl8AsdOF9mko/IffNymjAK7KKlopR5rYSAsPEZn54lmaWbYwtRbEeho8RZvFE7K8DXSVcVNI9hR0IKdhW04cLHFWd4q2Uay/o8/ACEK4p5jstgbhaPRxpMj0YmC0Vj8kjKJcj2xAwk0AcnkSlMaV3Wr1MxhAuHDtMVPZeSHy7+A6oZWEmu5yMo541SpVA/cLLMS4B+prdAZBZrsayDGCMTE7Fym7pmGYruvJilS3jmBt4tE2H6+FXsvCKOF1T176Na7PzInGoD/ZWamkgZCNS36qmqZmCGO2ulF1E3HSLgRU1AWRDS5J2goMRBqqxcWzwKUaj32HzmJ3YeOpwS1DT9cpwP8i2s87+1haoCBMKcwbvATCC+URvITNi96hxXYc74BWwtasfOcMHG6QvSeQmX4+xtO7E6ef7efSWiSFg1Ea42kk5qJIVq0i2jl1uaBSJ/AgDFGD/Jh0uSFhiSCjUDUNXVg69uHcSTvXPN6ZYIBuL+X5xebyYsLrUwsLkNOABRGL7GPB2bXPMqqG/D8lp04dKFuQKYyfPumsqMhnR7sBqO8NIatK5BSsM9h21qMUPTb1ppPbqCHUdpVJg9mLB7knSvBq9ve4RtaO55cL4hS4ME6Zp6osetI1/QRXTMAkxTMyhrtc8g9exFbtu6CuKvpuzfVTkT7f9qW4heGaSKPE4hRRxIj9t/EqG2VpmwKrTbmeyO4NjMH+YwHSnJhShpAu48WYuOWHbSf+MJ6QRSt8mdqiJ1qmDqmBQwbQxkALKaINAyBBC40SvDcq2+5Idxwx01BCIFvDPO82hzkXZpAKqEi/ialDCV9TvoAqYtHC+1YMxtKJDXGyQOPk09QzLgytvPNoxfxy+2HTDfzwR8YJ+DewgifqCIfXkMA2owpjFE/DOt9ZJ68pMn8ROER6MPMfHliLQpbUUGB8BsfC8KTxAP5Cv5y/my6u1DHHxuJpVtm4vxlUyI15ojzk6MJYhDvGhX20VBiRn4kcwDgJBpcwJH3WvHfm3ca15uFox6+ooJ8SJWRZg7NnT7qB6Zoe7gAujU+9KhI6lMM6sgo+VOwUsZ6tfMeQT+38WN74pgs+diWjmj7wxc9I8/WB7yPli9wGzti9r2KhFZOW9xyHUS3eZXk8xyGORdGOAdN0iAktIM/2LTL8/UNG758MwCnbPz5IpoNAiObOTxE5CkmrBHIbKwPExmZIdYFMkC6VR7yLV4MG4IgGwKO3GXHKFcnEAj+/KZ+Iq9EdO8rJeP/urnM/OpPOq0lHUwikAptZVRoTdOi5yHl3BROyoobTtJTV4fU+NHLe1+84dEmh/sO6fh3L9JmVBCAClKm9boVyC1hTJN0GSO/IbvegzLqwSEyUX36EAlDH64RG2pt8/AGoxD1SJB3qnhKLJbds24/weyhhox/N+1Es31NIojJFA0RCAkLrRvjNKSsRAri2Ui0cmwur1Rs+J5QZr5PoAjeVzCeePjkJH8iX8kHS+j+Chqe5RoeQh0RhimSEY9MeynIPMkc/IcIJUWgUiTxw9DZfCQqw1BMc9h3OB97j5xAU5f4O+sGcdnOH7/oJ/9MbVtF5N5oSJMro7RTNga0zKKuBavfcSdNc2rWakUAl4bnVs7LFlbOTSRRSjtfpmeHAmmUT5MD1CxlGjcj320L0JH24lyR9ARlSUOEMkXlpqQYIzKR03caHPNw+YIorazDrgO5yM49Vb5ue/qKEk/lW3meLaKUXJWQo0WS9RyxLZMrI4tJroyxSQ81Y5fah071PDq1C2jnoqinQXlVncBVzUrms0abRI0miVb9EuTW3wDgHEHy1iHMLURTmli6aWqZL7GtpgfsFLMh3q2ZT4XcIRqEimm8k52Ptw8eXxaJJd9aF4hXNHg618YnBVQ+5eSh69VErSSPp0lVMp/MXFm/lc+UVrd2PgOgXR1Am2oBLaogGtVhCNUkV9RLBCiBFv0KOUHy3CTfle9ngPyH2R2GLxTHgESGvYWVy/9xcca+qS9m/ln7Yl/2VFKSNc0fGQulRsqu1mNXVg5yTxeVreugYLMKz+RY+ZSAFlqmSaGBBgaTxgwAk8dDVKtiBoJigIZjv4kWSAami+ijQxtCuzacyUaHLpZZODvxGLPFMWglZpvxZw7U5AY31GbSXu4g+qXjOJhzGkdyzyK3sKx8c7nx+f+5qM/+aaW77dFS++jTTWHXxrO9VEZnMT6u+NZNQWyU49lcC89XUAYq1MsQTZOqtAU/0Pack0C40h8CQVOcNTux1gAxyoglhhFrHKNWdsqxCLmDHRiQyXEk0EnXDc5GMEozZlTnwITeiRG1CVuzz2Dv0VOs5pl8+8pHmK1E+LVXBaqHSkWDD9/0yKYhjieYIGuhSd1o4tFLw2faEshoe468s9kTgT0QxzANv8HAmtFnIDoda9NcZiIGsQRJuqwd1civn3goKfodKbSzgwGaM2xYsvNZOQWzmm/klGDz9oPsHPquW37dJUviEQ3Pp0fYhDauQO2I0uLDMFDdusgWGlykWPuUONKjRQtRqiy2ZmpqyWK2WVIk0QMZjzFJzkzhiGOSFj/tjGHaE0cXyRd2bsWyITUEMKZbO9nQWrw4Ud6Gh597rfu2vbPr4bF3lrZkeCEFAzkrB7kqqy+MbrkBORU92HauEW8cL8c79cr+Kyt8oDWxdngsJtplwo2ZGM5Ojs+TgDGwApMvgdmlFEZWyEu71g4H+kmxjr3/8oVAlIukeOxn271CYd5dtwXEhg34giyVGifKhtNHckBtI087iK20+LfON+Lo5SZVq1j2JP33lxt43tpCGqie9KuMeJ9lQWulwef2k++eh1ATxXmJD8evBTFIN/SF17LRTZJepp/DGGcnF+eGSDqFJ17PSv1656F/um1vT+mB35nwBpfKuyZp4U3YUdhMnrZxvqxp8FV2pMiuIeX7Dz30QwMNwhayluxMlWVBT3bV4w+iWtiEnx++gucKx/CTM1JjiSu8xE442ml3uhzpjF6aNPpIznsgUxmxcVc+Nm098IvbBiIj1Kolj2WXdkb3XWhIFdf2Hg4GPb91akF66nlmouo8QI8lARXLAvPF3hCmtGRXj57EngPHIGzteYG82x007P95kudXWFmJncnMEQw7ZLPPL8I8F8aOE2V4fNObp277e2yhSPzX4yru95r+Np7PHWDv5qg82BmRxuLDDJWQm7JQWduI7fuO4VThpf7fORzYx04R5f4VWInpGFmw11tXOuTYXSzCizuOSj/Tl/FkbCSsnAapvuU0yLQk0uw+cmcqDntJpO0/dgqDEtm//9Z5Uxe+OJZKjbGXDhyBvto7iT3FrdhW0ISs4qbohZrunM8MBJXGnaIkP8NYjKNmVVBfGH1xuH0BMHmwfd9RnLtQ2v/77h2nfuuYNqVzr0qw/XwL9hQ14lRVZ7nKYLj/M/2zCFkC97QH+UtqcoCGJV7gWOInvbFVvWpaldpzKA9HTpyHSsU9cqP732uQPpv1XsfUgeL6LrFM9W+fy992GAy484CCf/On7YvcD1uj41sGl2VbRlar86u6+X2H85B/9kL5p/lHL7f1ZfyxJu6B16uMLz9d7jrwTKWj8+lLOunuvCKrWCT4q/83IG7gBO/8rAGw+D+DWVhrJa820gAAAABJRU5ErkJggg=='/>
									동작
								</td>
								
								<td onclick="transition($('#main-menu'), $('#3'));">
									<img src='data:image/png;base64,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'/>
									테마
								</td>
								
								<td onclick="transition($('#main-menu'), $('#4'));">
									<img src='data:image/png;base64,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'/>
									소리
								</td>
							</tr>
							
							<tr>
								<td onclick="transition($('#main-menu'), $('#2'));">
									<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAoCAYAAABnyQNuAAAHrElEQVRYhe3YaVDTiRnHcWb6qu3LznTa6YvOtNO3JQmHiouu9wrhCIJALkgCCh4o623lPkJAwyEgICKCcl9ZEUHp7oou4rUeeGPV1XVRAfFiUVb49kUCQkwA6zWd2Wfm9/6T3/P8/5PExubX+T+YwP38Q254flVp6ENe+7TLr7TL9VOb3hilof+w0tCHtcgquts/KVBa/+Jvyrq+wfGQ5lHUPX9ptyT3dx8F6FPBb5Rf/Txp3HhZkHx0+QdBKvYPLH8fQEvxLb7T+c5AzQH++r5anNyJPEOsb/3LW0PVh3j4sZCW4pnXnjVpbHBVJwX3YWnTy08Gnp/QODgh1D37fJ9LdC2ShDpWll0n5+YQm08NfTSkX8k9poflIAqI4+9fBEvGxc6ONjB1qR5HjY6ZYdmIoyoI3NFK8ukBUm9A4Ae4Y3nNExbENzItNA3nFRnM+jKPz9ftwVYew7jY6eH5OGh0OGiScNDocNTocApNZcGmInxSDrK5sYudP8Ly5oF3RkryLuO0Iovpy9P5fFU2czYUMT+qmoWJDbgkHcJ5TZF17Dxtc4RDSBr2Gh32Gt0otDFTgpOZvSYPj/galu27THbHEBFnBt8KKK3sZtamMpxC05mxcjuz1+5i3pYKFsbV46JtwjX5a8Rbj+GmP87c2APWsbO31H7nsGQb9kG6EfBr+Gu0Y1ASM1Zm4hJZiiyzBe3JATJvMy5SnNbGtNB045pX5zB30z4WxBhwSWzEVdeMOOUIYn0rbmltuGecwj3zexamHLWOnbGhBIclWy1irbU9LWQb8zcWskhXz8aDD8nqGEJZ0Ylv6X28dl7BOTyf6csymBmWyZx1hcyPqGJhQgOuSYcRp3yDm/47IzD9FO7bz+CRfQ6PnAt45l5EnH7SOtZpVT4OwSlG7HCsoM3bHj6Rz1Zm4RCUjGNQMq4bdyGJq2Te5lK+iKvHVduEOPlrxNtacEs9jnv6STy2n8Yj6yweO87jkdOOZ94lJPlX8Np1DY/ss9axU0K3Yx+cPBZrCa0eldFotRZRQAL2qiQcQ9IRxxvwyz6Bq+7fiLcewU3finvaCdwzTuGR+T2e2efx3GFsUbLzMpL8q3gVXGfR7hssKvwPnrnt1rGOS9KwD7KCNYerLUSViEgZi0iVyPTwAlyTDuOTcw731DZTi2fwzDpnBJq16FXQYULexLvoFj7FPyDZeWU8rH5iqKW2TVhRQAJCRSx2ah0zN5bgpj+Kd95FPDPP4pl9AUlOOxIrLXrvuYV30W18iu+weO9dfPfdw6ug4z1izdDCgDgE8hgcl2YwN9qAZ+ZpfPKvIcm9ZAbsGAH6FP0wAly87x6+JT/hV9qJX9l9FhVc/wBYU4TyaASyaJxW5eKqa8Y7tx3fwpt4Fbxes3fhTbz33H4D6GsCGvMA/7IHeO2aCDv6QXpLrEAWjVAey4y1BUgyWvEv7MC/+I7xDkdavMvivT8akaWd+JUaccNA//KHpnQhyb82AXbUU/62aIEsCpEynjn/KsV/53mUpXeRlf5katEELDG+g/1KH5iQD/Evew2UlnchrehGWtGNZ+6lSWL/B7RAGomdSotLXB2qvR0EVXehqOwyrrnEErBrJNJyI1Ba2YOssgdpZQ9u28d5zzoEb7P8SpokXCCNxCEoBY/kJkKq7rGs/hmquif4lT00AbtGAU24ih4T8BGyqkfIqnuRV/ciq+rFJbWtxSrWTpN8flzsBGiBNJKpS/Us0n/DCkMXYY39qAzPTMhuI7DcBKwYBazqNSEfI695grzmKbKqx8zTHvK3ihUGaBONoKSJweZwE3basnR8M44R3vCE1c2/EGh4jn95D9LyHqQVj5BWPjIh3wTKa54hr32OvLYP/8re8b/L/lOx9vf26iTsVVrs1UnYqZOwG4NLGveD2Moi+SwsG9mOE6xv7ufLb4cINPQhrXiErNK4WlnVY2TVj5FXmwONSHndzygM/fhXdI+PtbGxsbFTaxEFJmCnSsROpTWBjWi7EaxltK0sgpnheQTuOsvmlkHWtBh/WbwJHNuioq4PhcGIVHz1AuX+l/gU350YK1TEXBQoohEGxCIKjMduGK4eDTdHG2Mri2LWmt0EFV8msg3WHAPV/v4xQEXtcxSjgEpDP0oTUFk/QMCBV6gaBpHsuPHHCbE2NjY2Tqt27RYGJiCQRyFUGtGW2x4Lt5VGMnfjPkLLbxJ7BtYdB3X9SxNwGDkM7Ee5/4UJ+AuBDYOoDg6hbgJV49DErZqP8+rcPzuEpJrQMYgC4oxtqxIRqbSI1EmIRtBabGVRLNhSTlhdJ9oLsL4N1PUDKOv6UFpoMfDAK1QNQ6gbQX0INM0QdJiMt4aaz9Sw3LsCRQxCRQxCE1qkSkCkSkSk1iJSa7GVRuAaU8e6xl62XoUNJ0FVP2ACWm5RcxiCmkFZwx/eGWk+zusLU0XqRASKmDEnIlIlYiuLxD2hnoiWl6TdgrUnIKB+gAArLS5pYsp7B1qaaeH63zqEpA8J5NEIFcYTESrj8NraTPypITLvwerjjAA1w2tu5ulHAVqbqatyrwsUsTguTcNL/y3J7aC/A6EtI2seDDzAnz4p0nycN5etE+tbWXvkFWHHQNPM5P9g+3U+4fwXMT/3xhGXqW8AAAAASUVORK5CYII='/>
									효과
								</td>
								
								<td onclick="transition($('#main-menu'), $('#2'));">
									<img src='data:image/png;base64,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'/>
									동작
								</td>
								
								<td onclick="transition($('#main-menu'), $('#2'));">
									<img src='data:image/png;base64,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'/>
									정보
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
			
			<div class=mc-transition id=actions-menu>
				<div class=mc-inner-wrapper>
					<div class="mc-inner-content menu-list" style="margin-left: 100px;">
						<h2>
							<button class=back onclick="transitionReverse($('#main-menu'), $('#actions-menu'));">&lt;</button>
							동작
						</h2>
						
						<div class=mc-itemlist>
							<div class=mc-item onclick="transition($('#actions-menu'), $('#script-enhancments'));">스크립트를 통한 사용 경험 향상</div>
							<div class=mc-item>추가 토론 편의 기능</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class=mc-transition id=script-enhancments>
				<div class=mc-inner-wrapper>
					<div class="mc-inner-content settings" style="margin-right: 200px; float: right;">
						<h2>
							스크립트
						</h2>
						
						<div class=settings-menulist style="width: 100px; display: inline-block;">
							<div class=mc-item onclick="transitionReverse($('#actions-menu'), $('#script-enhancments'));" save>저장</div>
							<div class=mc-item onclick="transitionReverse($('#actions-menu'), $('#script-enhancments'));" cancel>취소</div>
						</div>
						
						<div class=settings-section style="display: inline-block;">
							<div class=form-group>
								<label><input type=checkbox id=noscriptDiscussInput name=no-discuss-script ${req.cookies['no-discuss-script'] ? 'checked' : ''} /> 토론 페이지에서 스크립트 의존 안함</label><br />
								<label><input type=checkbox id=noscriptUploadInput name=no-upload-script ${req.cookies['no-upload-script'] ? 'checked' : ''} /> 파일 업로드 페이지에서 스크립트 의존 안함</label><br />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div> -->
	`;
	
	res.send(await render(req, lang(req, '사용자 지정', 'Tweaks'), content, {}, _, _, 'customization'));
});

wiki.post('/Customize', async function saveSettings(req, res) {
	for(setting of ['ddochi', 'no-discuss-script', 'no-upload-script', 'always-hide-hidden-res', 'hide-strikethrough', 'unbold', 'unitalic', 'space-bonefish', 'bioking']) {
		const val = req.body[setting];
		if(!val) {
			res.clearCookie(setting);
		} else {
			res.cookie(setting, val, {
				maxAge: 1000 * 60 * 60 * 24 * 365
			});
		}
	}
	
	res.redirect('/Customize');
});